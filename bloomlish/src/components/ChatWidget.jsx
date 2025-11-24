import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { MessageCircle } from "lucide-react";

function ChatWidget({ currentUserId }) {
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState({});
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const chatContainerRef = useRef(null);

    // Logout olduğunda chat panelini kapat ve kullanıcıyı resetle
    useEffect(() => {
        if (!currentUserId) {
            setChatOpen(false);
            setSelectedUser(null);
        }
    }, [currentUserId]);

    // WebSocket bağlantısı
    useEffect(() => {
        if (!currentUserId) return;

        const socket = new SockJS("http://localhost:8080/socket");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log("[STOMP]", str),
            onConnect: () => {
                setIsConnected(true);
                client.subscribe(`/user/${currentUserId}/queue/messages`, (frame) => {
                    const message = JSON.parse(frame.body);
                    const senderUsername = users.find(u => u.id === message.senderId)?.username || "Bilinmeyen";
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

    // Kullanıcı listesi
    useEffect(() => {
        if (!currentUserId) return;

        fetch("http://localhost:8080/api/users/all", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
            .then(res => res.ok ? res.json() : Promise.reject("Kullanıcı listesi alınamadı"))
            .then(data => {
                const filtered = data.filter(u => u.id !== currentUserId);
                setUsers(filtered.map(u => ({ ...u, online: true })));
            })
            .catch(err => console.error(err));
    }, [currentUserId]);

    // Mesaj geçmişi
    useEffect(() => {
        if (!selectedUser || !currentUserId) return;

        fetch(`http://localhost:8080/api/messages/get/${currentUserId}/${selectedUser.id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
            .then(res => res.ok ? res.json() : Promise.reject("Mesaj alınamadı"))
            .then(data => {
                const formatted = data.map(m => {
                    const sender = m.senderId === currentUserId ? "Sen" : users.find(u => u.id === m.senderId)?.username || "Bilinmeyen";
                    return { from: sender, text: m.content };
                });
                setMessages(prev => ({ ...prev, [selectedUser.id]: formatted }));
            })
            .catch(err => console.error(err));
    }, [selectedUser, currentUserId, users]);

    // Scroll en alta
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, selectedUser]);

    const sendMessage = () => {
        if (!input.trim() || !selectedUser || !currentUserId) return;

        const messageDto = { senderId: currentUserId, receiverId: selectedUser.id, content: input };

        if (stompClient && isConnected) {
            stompClient.publish({ destination: "/app/send", body: JSON.stringify(messageDto) });
        }

        fetch("http://localhost:8080/api/messages/send", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(messageDto),
        }).catch(err => console.error(err));

        setMessages(prev => ({
            ...prev,
            [selectedUser.id]: [...(prev[selectedUser.id] || []), { from: "Sen", text: input }],
        }));
        setInput("");
    };

    // **Logout durumunda tamamen görünmez**
    if (!currentUserId) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Bubble */}
            <button
                onClick={() => { setChatOpen(!chatOpen); setSelectedUser(null); }}
                className="bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition"
            >
                <MessageCircle className="w-6 h-6" />
            </button>

            {/* Chat Panel */}
            {chatOpen && (
                <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col mt-2">
                    <div className="p-4 border-b flex justify-between items-center bg-gray-100 rounded-t-lg">
                        <span className="font-semibold">Sohbet</span>
                        <button onClick={() => setChatOpen(false)}>✖</button>
                    </div>

                    {/* Kullanıcı Listesi */}
                    {!selectedUser && (
                        <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
                            {users.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center mt-4">Kayıtlı kullanıcı bulunamadı.</p>
                            ) : (
                                users.map(user => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-300 text-white font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium">{user.username}</span>
                                        <span className={`w-3 h-3 rounded-full ml-auto ${user.online ? "bg-green-500" : "bg-gray-400"}`}></span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Sohbet Paneli */}
                    {selectedUser && (
                        <>
                            <div className="p-2 border-b flex justify-between items-center bg-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-300 text-white font-bold">
                                        {selectedUser.username.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold">{selectedUser.username}</span>
                                </div>
                                <button onClick={() => setSelectedUser(null)}>←</button>
                            </div>

                            <div ref={chatContainerRef} className="flex-1 p-2 overflow-y-auto space-y-2 bg-gray-50">
                                {(messages[selectedUser.id] || []).map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`max-w-[70%] text-sm px-3 py-2 rounded-lg break-words ${msg.from === "Sen"
                                            ? "bg-pink-100 text-pink-700 self-end"
                                            : "bg-gray-200 text-gray-800 self-start"
                                            }`}
                                    >
                                        <strong>{msg.from}: </strong>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            <div className="p-2 border-t flex gap-2 bg-gray-100">
                                <input
                                    type="text"
                                    placeholder="Mesaj yaz..."
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!isConnected}
                                    className={`px-4 py-2 rounded-full text-white ${isConnected
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
