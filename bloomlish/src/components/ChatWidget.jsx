import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function ChatWidget({ currentUserId }) {
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState({});
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

   
    if (!currentUserId) {
        return null;
    }

    //  WebSocket bağlantısı kurulumu
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/socket");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),

            onConnect: () => {
                console.log(" WebSocket bağlantısı kuruldu");
                setIsConnected(true);

                // kullanıcının kendiisne gelen mesajdan haberi olsun diye hemen ekrana yazılsın yani
                client.subscribe(`/user/${currentUserId}/queue/messages`, (frame) => {
                    const message = JSON.parse(frame.body);
                    console.log("Yeni mesaj alındı:", message);

                    setMessages((prev) => ({
                        ...prev,
                        [message.senderId]: [
                            ...(prev[message.senderId] || []),
                            { from: message.senderId, text: message.content },
                        ],
                    }));
                });
            },

            onDisconnect: () => {
                console.warn(" WebSocket bağlantısı koptu");
                setIsConnected(false);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
            setIsConnected(false);
        };
    }, [currentUserId]);

    // 🧩 Kullanıcı listesini backend'den çek
    useEffect(() => {
        if (!currentUserId) return;

        fetch("http://localhost:8080/api/users/all", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Kullanıcı listesi alınamadı");
                return res.json();
            })
            .then((data) => {
                const filtered = data.filter((u) => u.id !== currentUserId);
                setUsers(filtered.map((u) => ({ ...u, online: true })));
            })
            .catch((err) => console.error(" Kullanıcı listesi yüklenemedi:", err));
    }, [currentUserId]);

    // 💬 Mesaj geçmişini backend'den çek
    useEffect(() => {
        if (!selectedUser || !currentUserId) return;

        fetch(`http://localhost:8080/api/messages/get/${currentUserId}/${selectedUser.id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Sunucudan yanıt alınamadı");
                return res.json();
            })
            .then((data) => {
                const formatted = data.map((m) => ({
                    from: m.senderId === currentUserId ? "Sen" : selectedUser.username,
                    text: m.content,
                }));
                setMessages((prev) => ({ ...prev, [selectedUser.id]: formatted }));
            })
            .catch((err) => console.error(" Mesaj geçmişi alınamadı:", err));
    }, [selectedUser, currentUserId]);


    // 🚀 Mesaj gönderme

    const sendMessage = () => {
        if (!input.trim() || !selectedUser || !currentUserId) return;

        const messageDto = {
            senderId: currentUserId,
            receiverId: selectedUser.id,
            content: input,
        };

        // 💬 WebSocket üzerinden anlık mesaj gönder
        if (stompClient && isConnected) {
            stompClient.publish({
                destination: "/app/send",
                body: JSON.stringify(messageDto),
            });
        }

        // 📨 Mesajı veritabanına kaydetmek için backend'e gönder
        fetch("http://localhost:8080/api/messages/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageDto),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Mesaj kaydedilemedi");
                return res.json();
            })
            .catch((err) => console.error(" Mesaj gönderilemedi:", err));

        // 💎 Ekranda anında göster
        setMessages((prev) => ({
            ...prev,
            [selectedUser.id]: [
                ...(prev[selectedUser.id] || []),
                { from: "Sen", text: input },
            ],
        }));

        // ✨ Input'u temizle
        setInput("");
    };

    
    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Bubble */}
            <button
                onClick={() => setChatOpen(!chatOpen)}
                className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
                💬
            </button>

            {/* Chat Panel */}
            {chatOpen && (
                <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col mt-2">
                    <div className="p-4 border-b flex justify-between items-center">
                        <span className="font-semibold">Sohbet</span>
                        <button onClick={() => setChatOpen(false)}>✖</button>
                    </div>

                    {/* Kullanıcı Listesi */}
                    {!selectedUser && (
                        <div className="flex-1 overflow-y-auto p-2">
                            {users.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center mt-4">
                                    Kayıtlı kullanıcı bulunamadı.
                                </p>
                            ) : (
                                users.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                    >
                                        <span>{user.username}</span>
                                        <span
                                            className={`w-3 h-3 rounded-full ${user.online ? "bg-green-500" : "bg-gray-400"
                                                }`}
                                        ></span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Sohbet Paneli */}
                    {selectedUser && (
                        <>
                            <div className="p-2 border-b flex justify-between items-center">
                                <span className="font-semibold">{selectedUser.username}</span>
                                <button onClick={() => setSelectedUser(null)}>←</button>
                            </div>
                            <div className="flex-1 p-2 overflow-y-auto space-y-2">
                                {(messages[selectedUser.id] || []).map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`text-sm px-2 py-1 rounded ${msg.from === "Sen"
                                                ? "bg-pink-100 text-pink-700 self-end"
                                                : "bg-gray-100 text-gray-700 self-start"
                                            }`}
                                    >
                                        <strong>{msg.from}: </strong>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 border-t flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Mesaj yaz..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 border rounded-md px-2 py-1 text-sm"
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!isConnected}
                                    className={`px-3 py-1 rounded-md text-white ${isConnected
                                            ? "bg-pink-500 hover:bg-pink-600"
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Gönder
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default ChatWidget;
