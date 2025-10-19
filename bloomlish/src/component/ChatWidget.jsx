// src/components/ChatWidget.jsx
import React, { useState, useEffect } from "react";

const dummyUsers = [
    { id: 1, username: "Deniz", online: true },
    { id: 2, username: "Zeynep", online: true },
    { id: 3, username: "Aymina", online: false },
    { id: 4, username: "Selin", online: true },
];

const dummyMessages = {
    Ali: [{ from: "Deniz", text: "Merhaba!" }],
    Ayşe: [{ from: "Zeynep", text: "Selam! " }],
    Mehmet: [],
    Zeynep: [],
};

function ChatWidget({ currentUserId }) {
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(dummyUsers);
    const [messages, setMessages] = useState(dummyMessages);
    const [input, setInput] = useState("");

    // Backend  için
    /*
    useEffect(() => {
        if (chatOpen && !selectedUser) {
            fetch("/api/users/online")
                .then(res => res.json())
                .then(data => setUsers(data))
                .catch(err => console.error(err));
        }
    }, [chatOpen, selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            fetch(`/api/messages/${currentUserId}/${selectedUser.id}`)
                .then(res => res.json())
                .then(data => setMessages(prev => ({ ...prev, [selectedUser.username]: data })))
                .catch(err => console.error(err));
        }
    }, [selectedUser]);
    */

    const sendMessage = () => {
        if (!input.trim() || !selectedUser) return;

        // frontend state güncelle
        setMessages(prev => ({
            ...prev,
            [selectedUser.username]: [
                ...(prev[selectedUser.username] || []),
                { from: "Sen", text: input },
            ],
        }));

        // backenddd
        /*
        fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                senderId: currentUserId,
                receiverId: selectedUser.id,
                message: input,
            }),
        }).catch(err => console.error(err));
        */

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
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                >
                                    <span>{user.username}</span>
                                    <span
                                        className={`w-3 h-3 rounded-full ${user.online ? "bg-green-500" : "bg-gray-400"}`}
                                    ></span>
                                </div>
                            ))}
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
                                {(messages[selectedUser.username] || []).map((msg, idx) => (
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
                                    className="bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600"
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
