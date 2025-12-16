import React, { useRef, useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { useParams } from "react-router-dom";
 

const VideoLessonPage = () => {
    useEffect(() => {
        beginSession();
    }, []);

    const { lessonId, id } = useParams();
    const roomKey = lessonId || id || "default";
    const roomId = `room-${roomKey}`;

    const localStreamRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const peerConnectionRef = useRef(null);
    const stompRef = useRef(null);
    const pendingCandidatesRef = useRef([]);

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [error, setError] = useState("");

    const [clientId] = useState(
        () =>
            (typeof crypto !== "undefined" &&
                crypto.randomUUID &&
                crypto.randomUUID()) ||
            Math.random().toString(36).substring(2)
    );

    const beginSession = async () => {
        try {
            if (stompRef.current && stompRef.current.connected && peerConnectionRef.current && localStreamRef.current) {
                console.log("Zaten derse bağlısın.");
                return;
            }

            await startCamera();
            await connectWebSocket();
            createPeerConnection();
            stompRef.current?.send(
                `/app/video/${roomId}`,
                {},
                JSON.stringify({ type: "join", senderId: clientId })
            );

            console.log("Derse başlama tamamlandı.");
        } catch (e) {
            console.error("beginSession hata:", e);
            setError("Derse bağlanırken bir hata oluştu.");
        }
    };

    const leaveCall = () => {
        console.log("Dersten ayrılıyor...");

        // Karşı tarafa leave sinyali gönder
        if (stompRef.current && stompRef.current.connected) {
            stompRef.current.send(
                `/app/video/${roomId}`,
                {},
                JSON.stringify({ type: "leave", senderId: clientId })
            );
        }

        // PeerConnection kapat
        if (peerConnectionRef.current) {
            try {
                peerConnectionRef.current.ontrack = null;
                peerConnectionRef.current.onicecandidate = null;
                peerConnectionRef.current.oniceconnectionstatechange = null;
                peerConnectionRef.current.close();
            } catch (e) {
                console.warn("PC kapanırken hata:", e);
            }
            peerConnectionRef.current = null;
        }

        // Remote video temizle
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        // Local stream durdur
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        // WS bağlantısını kapat
        if (stompRef.current) {
            try {
                stompRef.current.disconnect(() => {
                    console.log("STOMP: Disconnected");
                });
            } catch (e) {
                console.warn("STOMP disconnect hata:", e);
            }
            stompRef.current = null;
        }

        pendingCandidatesRef.current = [];
        setIsCameraOn(false);
    };


    const startCamera = async () => {
        try {
            setError("");

            if (localStreamRef.current) {
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            localStreamRef.current = stream;

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            setIsCameraOn(true);
            console.log("Kamera açıldı.");
        } catch (err) {
            console.error("Kamera açılamadı:", err);
            setError("Kamera/mikrofon izni verilmedi veya cihaz bulunamadı.");
            throw err;
        }
    };

    const toggleCamera = () => {
        const track = localStreamRef.current
            ?.getVideoTracks()
            ?.find((t) => t.kind === "video");

        if (track) {
            track.enabled = !track.enabled;
            setIsCameraOn(track.enabled);
        }
    };

    const toggleMic = () => {
        const audioTrack = localStreamRef.current
            ?.getAudioTracks()
            ?.find((t) => t.kind === "audio");

        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            console.log("Mic:", audioTrack.enabled ? "Açık" : "Kapalı");
        }
    };

    const connectWebSocket = () => {
        return new Promise((resolve) => {
            if (stompRef.current && stompRef.current.connected) {
                return resolve();
            }

            const socket = new SockJS(`${import.meta.env.VITE_API_URL}/socket`);
            const client = over(socket);

            socket.onclose = () => {
                console.warn("WS koptu");
            };

            client.connect({}, () => {
                console.log("STOMP: Connected");

                client.subscribe(`/topic/video/${roomId}`, onMessageReceived);

                stompRef.current = client;

                resolve();
            });
        });
    };

    const createPeerConnection = () => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // Local trackleri ekle
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) =>
                pc.addTrack(track, localStreamRef.current)
            );
        } else {
            console.warn("createPeerConnection çağrıldığında localStream yok!");
        }

        pc.onicecandidate = (event) => {
            if (event.candidate && stompRef.current && stompRef.current.connected) {
                stompRef.current.send(
                    `/app/video/${roomId}`,
                    {},
                    JSON.stringify({
                        type: "candidate",
                        candidate: event.candidate,
                        senderId: clientId,
                    })
                );
            }
        };


        pc.oniceconnectionstatechange = () => {
            console.log("ICE state:", pc.iceConnectionState);
        };

        // Remote track
        pc.ontrack = (event) => {
            console.log("REMOTE TRACK GELDİ!");
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onnegotiationneeded = async () => {
            console.log("Negotiation needed → offer gönderiliyor...");
            try {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                stompRef.current?.send(
                    `/app/video/${roomId}`,
                    {},
                    JSON.stringify({
                        type: "offer",
                        sdp: offer.sdp,
                        senderId: clientId,
                    })
                );
            } catch (err) {
                console.error("Negotiation offer hatası:", err);
            }
        };


        peerConnectionRef.current = pc;

        // Eğer pc oluşmadan önce candidate geldiyse, şimdi ekle
        if (pendingCandidatesRef.current.length > 0) {
            pendingCandidatesRef.current.forEach((c) => {
                pc.addIceCandidate(c).catch((e) =>
                    console.error("Pending candidate eklenemedi:", e)
                );
            });
            pendingCandidatesRef.current = [];
        }

        return pc;
    };


    const startCall = async () => {
        const pc = createPeerConnection();

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        stompRef.current.send(
            `/app/video/${roomId}`,
            {},
            JSON.stringify({
                type: "offer",
                sdp: offer.sdp,
                senderId: clientId,
            })
        );

        console.log("Offer gönderildi.");
    };

    const onMessageReceived = async (message) => {
        const msg = JSON.parse(message.body);

        console.log("Gelen mesaj:", msg);

        if (msg.senderId === clientId) return;

        switch (msg.type) {
            case "join":
                console.log("Kullanıcı katıldı:", msg.senderId);

                createPeerConnection();

                if (clientId < msg.senderId) {
                    console.log("Ben hostum, offer gönderiyorum");
                    startCall();
                }

                break;

            case "leave":
                console.log("Kullanıcı odadan çıktı:", msg.senderId);

                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = null;
                }

                if (peerConnectionRef.current) {
                    try {
                        peerConnectionRef.current.close();
                    } catch (e) {
                        console.warn("PC close hata:", e);
                    }
                    peerConnectionRef.current = null;
                }
                break;

            case "offer": {
                console.log("Offer alındı.");
                const pc = createPeerConnection();

                await pc.setRemoteDescription({
                    type: "offer",
                    sdp: msg.sdp,
                });

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                stompRef.current.send(
                    `/app/video/${roomId}`,
                    {},
                    JSON.stringify({
                        type: "answer",
                        sdp: answer.sdp,
                        senderId: clientId,
                    })
                );
                console.log("Answer gönderildi.");
                break;
            }

            case "answer": {
                console.log("Answer alındı.");
                const pc = peerConnectionRef.current;
                if (!pc) return;

                await pc.setRemoteDescription({
                    type: "answer",
                    sdp: msg.sdp,
                });
                break;
            }

            case "candidate": {
                const candidate = msg.candidate;
                console.log("ICE candidate alındı.");

                const pc = peerConnectionRef.current;
                if (pc) {
                    try {
                        await pc.addIceCandidate(candidate);
                        console.log("Candidate eklendi");
                    } catch (e) {
                        console.error("Candidate eklenemedi:", e);
                    }
                } else {
                    // pc daha yoksa beklet
                    pendingCandidatesRef.current.push(candidate);
                }
                break;
            }
            default:
                console.log("Bilinmeyen mesaj türü:", msg.type);
        }
        switch (msg.type) {
            case "warning":
                alert(msg.message);
                break;

            case "force-leave":
                alert(msg.message);
                leaveCall();
                break;
        }

    };

    const startScreenShare = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
            });

            const screenTrack = displayStream.getVideoTracks()[0];

            const sender = peerConnectionRef.current
                ?.getSenders()
                ?.find((s) => s.track && s.track.kind === "video");

            if (sender) {
                await sender.replaceTrack(screenTrack);
            }

            screenTrack.onended = () => {
                const originalTrack = localStreamRef.current
                    ?.getVideoTracks()[0];
                if (originalTrack && sender) {
                    sender.replaceTrack(originalTrack);
                }
            };

            console.log("Ekran paylaşımı başladı.");
        } catch (e) {
            console.error("Ekran paylaşımı hata:", e);
        }
    };

    const buttonStyleBase = {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "none",
        fontSize: "15px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "0.2s",
    };

    const buttonStylePrimary = {
        ...buttonStyleBase,
        backgroundColor: "#4CAF50",
        color: "white",
    };

    const buttonStyleDanger = {
        ...buttonStyleBase,
        backgroundColor: "#ff4d4f",
        color: "white",
    };

    const buttonStyleSecondary = {
        ...buttonStyleBase,
        backgroundColor: "#e0e0e0",
        color: "#333",
    };


    return (
        <div
            style={{
                padding: "20px",
                minHeight: "100vh",
                backgroundColor: "#f7f7fa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <h1
                style={{
                    color: "#e75480",
                    fontSize: "28px",
                    fontWeight: "700",
                    marginBottom: "25px",
                }}
            >
                Video Ders
            </h1>

            {/* VİDEO ALANI */}
            <div
                style={{
                    display: "flex",
                    gap: "30px",
                    marginTop: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {/* BEN */}
                <div
                    style={{
                        background: "white",
                        padding: "15px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        width: "340px",
                    }}
                >
                    <h3
                        style={{
                            textAlign: "center",
                            marginBottom: "10px",
                            color: "#444",
                            fontSize: "18px",
                            fontWeight: "600",
                        }}
                    >
                        Ben
                    </h3>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "12px",
                            backgroundColor: "#000",
                        }}
                    />
                </div>

                {/* KARŞI TARAF */}
                <div
                    style={{
                        background: "white",
                        padding: "15px",
                        borderRadius: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        width: "340px",
                    }}
                >
                    <h3
                        style={{
                            textAlign: "center",
                            marginBottom: "10px",
                            color: "#444",
                            fontSize: "18px",
                            fontWeight: "600",
                        }}
                    >
                        Karşı Taraf
                    </h3>

                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "12px",
                            backgroundColor: "#000",
                        }}
                    />
                </div>
            </div>

            {/* BUTONLAR */}
            <div
                style={{
                    marginTop: "30px",
                    display: "grid",
                    gap: "12px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    width: "80%",
                    maxWidth: "700px",
                }}
            >


                <button
                    onClick={leaveCall}
                    style={buttonStyleDanger}
                >
                    Dersten Ayrıl
                </button>

                <button
                    onClick={toggleCamera}
                    style={buttonStyleSecondary}
                >
                    {isCameraOn ? "Kamera Kapat" : "Kamera Aç"}
                </button>

                <button
                    onClick={toggleMic}
                    style={buttonStyleSecondary}
                >
                    Mikrofon Aç / Kapat
                </button>

                <button
                    onClick={startScreenShare}
                    style={buttonStyleSecondary}
                >
                    Ekran Paylaş
                </button>
            </div>

            {/* HATA MESAJI */}
            {error && (
                <p style={{ color: "red", marginTop: "15px", fontWeight: 600 }}>
                    {error}
                </p>
            )}
        </div>
    );

};

export default VideoLessonPage;
