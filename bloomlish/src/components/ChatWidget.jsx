import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { MessageCircle } from "lucide-react";

function ChatWidget({ currentUserId, currentUserRole }) {

 
    if (!currentUserId || currentUserRole !== "ROLE_STUDENT") {
        return null;
    }

    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState({});
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const chatContainerRef = useRef(null);

    // Logout olduğunda chat panelini kapat
    useEffect(() => {
        if (!currentUserId) {
            setChatOpen(false);
            setSelectedUser(null);
        }
    }, [currentUserId]);

    // WebSocket bağlantısı
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/socket");

        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
            onConnect: () => {
                setIsConnected(true);

                client.subscribe(`/user/${currentUserId}/queue/messages`, (frame) => {
                    const message = JSON.parse(frame.body);

                    const senderUsername =
                        users.find(u => u.id === message.senderId)?.username || "Bilinmeyen";

                    setMessages(prev => ({
                        ...prev,
                        [message.senderId]: [
                            ...(prev[message.senderId] || []),
                            { from: senderUsername, text: message.content },
                        ],
                    }));
                });
            },
            onDisconnect: () => setIsConnected(false),
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [currentUserId, users]);

    // Öğrenci listesini çeker
    useEffect(() => {
        fetch("http://localhost:8080/api/users/students", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.ok ? res.json() : Promise.reject("Kullanıcı listesi alınamadı"))
            .then(data => {
                const filtered = data.filter(u => u.id !== currentUserId);
                setUsers(filtered.map(u => ({ ...u, online: true })));
            })
            .catch(err => console.error(err));
    }, [currentUserId]);

    // Mesaj geçmişini çeker
    useEffect(() => {
        if (!selectedUser) return;

        fetch(`http://localhost:8080/api/messages/get/${currentUserId}/${selectedUser.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.ok ? res.json() : Promise.reject("Mesaj alınamadı"))
            .then(data => {
                const formatted = data.map(m => ({
                    from: m.senderId === currentUserId ? "Sen" : "O",
                    text: m.content,
                }));
                setMessages(prev => ({ ...prev, [selectedUser.id]: formatted }));
            })
            .catch(err => console.error(err));
    }, [selectedUser]);

    // Scroll en alta
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, selectedUser]);

    const sendMessage = () => {
        if (!input.trim() || !selectedUser) return;

        const messageDto = {
            senderId: currentUserId,
            receiverId: selectedUser.id,
            content: input,
        };

        // WS
        if (stompClient && isConnected) {
            stompClient.publish({
                destination: "/app/send",
                body: JSON.stringify(messageDto),
            });
        }

        // DB'ye kaydet
        fetch("http://localhost:8080/api/messages/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageDto),
        });

        setMessages(prev => ({
            ...prev,
            [selectedUser.id]: [...(prev[selectedUser.id] || []), { from: "Sen", text: input }],
        }));

        setInput("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            <button
                onClick={() => {
                    setChatOpen(!chatOpen);
                    setSelectedUser(null);
                }}
                className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
                <MessageCircle className="w-6 h-6" />
            </button>

            {chatOpen && (
                <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col mt-2">
                    <div className="p-4 border-b bg-gray-100 flex justify-between">
                        <span className="font-semibold">Sohbet</span>
                        <button onClick={() => setChatOpen(false)}>✖</button>
                    </div>

                    {/* Öğrenci listesi */}
                    {!selectedUser && (
                        <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-200 cursor-pointer rounded-md"
                                >
                                    <div className="w-8 h-8 bg-pink-300 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user.username}</span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full ml-auto"></span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Mesajlaşma ekranı */}
                    {selectedUser && (
                        <>
                            <div className="p-2 bg-gray-100 border-b flex items-center gap-2">
                                <button onClick={() => setSelectedUser(null)}>←</button>
                                <span className="font-semibold">{selectedUser.username}</span>
                            </div>

                            <div
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50"
                            >
                                {(messages[selectedUser.id] || []).map((msg, i) => (
                                    <div
                                        key={i}
                                        className={`px-3 py-2 rounded-lg max-w-[70%] ${msg.from === "Sen"
                                                ? "bg-pink-100 self-end text-pink-700"
                                                : "bg-gray-200 self-start text-gray-800"
                                            }`}
                                    >
                                        <strong>{msg.from}: </strong>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            <div className="p-2 border-t bg-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Mesaj yaz..."
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                    className="flex-1 border rounded-full px-3 py-2 text-sm"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!isConnected}
                                    className="bg-pink-500 text-white px-4 py-2 rounded-full"
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
