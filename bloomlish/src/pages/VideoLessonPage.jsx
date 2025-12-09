import React, { useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const VideoLessonPage = () => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const [isCameraOn, setIsCameraOn] = useState(false);
    const [error, setError] = useState("");
    const [stompClient, setStompClient] = useState(null); // sadece UI/log için
    const [roomId] = useState("123");

    const peerConnectionRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const stompRef = useRef(null); // 👈 ASIL kullanılan STOMP client

    const [clientId] = useState(
        () =>
            (typeof crypto !== "undefined" &&
                crypto.randomUUID &&
                crypto.randomUUID()) ||
            Math.random().toString(36).substring(2)
    );

    const startCamera = async () => {
        try {
            setError("");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            setIsCameraOn(true);
        } catch (err) {
            console.error("Kamera açılamadı:", err);
            setError("Kamera/mikrofon izni verilmedi veya cihaz bulunamadı.");
        }
    };

    const stopCamera = () => {
        const videoElement = localVideoRef.current;

        if (videoElement && videoElement.srcObject) {
            const stream = videoElement.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoElement.srcObject = null;
        }

        setIsCameraOn(false);
    };

    const connectWebSocket = () => {
        const socket = new SockJS("http://localhost:8080/socket");
        const client = over(socket);

        client.connect({}, () => {
            console.log("STOMP: Connected");

            client.subscribe(`/topic/video/${roomId}`, onMessageReceived);

            stompRef.current = client;     // 👈 asıl kayıt
            setStompClient(client);        // sadece state için
        });
    };

    const createPeerConnection = () => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        const localStream = localVideoRef.current?.srcObject;
        if (localStream) {
            localStream
                .getTracks()
                .forEach((track) => pc.addTrack(track, localStream));
        }

        pc.ontrack = (event) => {
            console.log("REMOTE TRACK GELDİ!");
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onicecandidate = (event) => {
            const sc = stompRef.current;
            if (event.candidate && sc) {
                sc.send(
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

        peerConnectionRef.current = pc;
        return pc;
    };

    const startCall = async () => {
        const sc = stompRef.current;
        if (!sc) {
            alert("Önce WS Bağlan butonuna bas!");
            return;
        }

        const pc = createPeerConnection();

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        sc.send(
            `/app/video/${roomId}`,
            {},
            JSON.stringify({
                type: "offer",
                sdp: offer.sdp,
                senderId: clientId,
            })
        );

        console.log("Offer gönderildi");
    };

    const onMessageReceived = async (message) => {
        const msg = JSON.parse(message.body);

        console.log("Gelen mesaj:", msg);

        if (msg.senderId && msg.senderId === clientId) {
            console.log("Kendi mesajım, ignore ediyorum");
            return;
        }

        switch (msg.type) {
            case "offer":
                await handleOffer(msg);
                break;
            case "answer":
                await handleAnswer(msg);
                break;
            case "candidate":
                await handleCandidate(msg);
                break;
            default:
                break;
        }
    };

    const handleOffer = async (msg) => {
        console.log("Offer alındı:", msg.sdp);

        const sc = stompRef.current;
        if (!sc) {
            console.warn("stompClient yok → WS bağlanmamış, offer işlemeyi durduruyorum");
            return;
        }

        const pc = createPeerConnection();
        const remoteDesc = new RTCSessionDescription({
            type: "offer",
            sdp: msg.sdp,
        });

        try {
            if (pc.signalingState === "have-local-offer") {
                console.warn("Glare durumu: rollback yapıyorum");
                await pc.setLocalDescription({ type: "rollback" });
            }

            await pc.setRemoteDescription(remoteDesc);

            for (const c of pendingCandidatesRef.current) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(c));
                } catch (e) {
                    console.error("Queued candidate eklenemedi:", e);
                }
            }
            pendingCandidatesRef.current = [];

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            sc.send(
                `/app/video/${roomId}`,
                {},
                JSON.stringify({
                    type: "answer",
                    sdp: answer.sdp,
                    senderId: clientId,
                })
            );

            console.log("Answer gönderildi");
        } catch (e) {
            console.error("Offer handle edilirken hata:", e);
        }
    };

    const handleAnswer = async (msg) => {
        const pc = peerConnectionRef.current;
        if (!pc) {
            console.warn("PC yokken answer geldi, yok sayıyorum");
            return;
        }

        console.log("Answer alındı, signalingState:", pc.signalingState);

        if (pc.signalingState !== "have-local-offer") {
            console.warn(
                "Ben offer'cı değilim (signalingState=",
                pc.signalingState,
                "), answer'ı yok sayıyorum"
            );
            return;
        }

        await pc.setRemoteDescription(
            new RTCSessionDescription({
                type: "answer",
                sdp: msg.sdp,
            })
        );

        for (const c of pendingCandidatesRef.current) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(c));
            } catch (e) {
                console.error("Queued candidate eklenemedi:", e);
            }
        }
        pendingCandidatesRef.current = [];

        console.log("Remote answer set edildi, state:", pc.signalingState);
    };

    const handleCandidate = async (msg) => {
        console.log("Candidate alındı");

        const pc = peerConnectionRef.current;
        if (!pc) return;

        if (!pc.remoteDescription) {
            console.warn("Remote description yok, candidate kuyruğa alınıyor");
            pendingCandidatesRef.current.push(msg.candidate);
            return;
        }

        try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
            console.log("Candidate eklendi");
        } catch (e) {
            console.error("Candidate eklenemedi:", e);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Video Ders</h1>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                <div>
                    <h3>Ben</h3>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: "300px", backgroundColor: "#000" }}
                    />
                </div>

                <div>
                    <h3>Karşı Taraf</h3>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={{ width: "300px", backgroundColor: "#000" }}
                    />
                </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                {!isCameraOn ? (
                    <button onClick={startCamera}>Kamerayı Aç</button>
                ) : (
                    <button onClick={stopCamera}>Kamerayı Kapat</button>
                )}

                <button onClick={startCall}>Bağlan (Call)</button>
                <button onClick={connectWebSocket}>WS Bağlan</button>
            </div>

            {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
        </div>
    );
};

export default VideoLessonPage;
