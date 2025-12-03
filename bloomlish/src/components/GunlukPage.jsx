import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { UserIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";

function GunlukPage() {
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem("token");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/notes/get-all", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPosts(data.content);
            })
            .catch((err) => console.error(err));
    }, []);

    const handlePublish = async () => {
        if (text.trim() === "") return;

        try {
            if (editingId) {
                const res = await fetch(`http://localhost:8080/api/notes/update/${editingId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: text })
                });
                const updatedPost = await res.json();
                setPosts(posts.map((p) => (p.id === editingId ? updatedPost : p)));
                setEditingId(null);
                setText("");
            } else {
                const res = await fetch("http://localhost:8080/api/notes/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ content: text })
                });
                const savedPost = await res.json();
                setPosts([savedPost, ...posts]);
                setText("");
            }
        } catch (err) {
            console.error(err);
        }
    };
    const handleEdit = (post) => {
        setEditingId(post.id);
        setText(post.content);
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Emin misiniz?",
            content: "Bu günlük yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            okText: "Evet, sil",
            okType: "danger",
            cancelText: "Vazgeç",
            onOk: async () => {
                try {
                    const res = await fetch(`http://localhost:8080/api/notes/delete/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (!res.ok) throw new Error("Yazı silinemedi");
                    setPosts(posts.filter((p) => p.id !== id));
                    message.success("Yazı silindi ✅");
                } catch (err) {
                    console.error(err);
                    message.error("Yazı silinemedi ❌");
                }
            }
        });
    };

    return (
        <PageLayout title="GÜNLÜK YAZILAR">
            {/* ÜST KART – yeni yazı alanı, ortalanmış */}
            <div className="w-full flex justify-center mb-8">
                <div className="w-full max-w-md bg-pink-50 rounded-3xl shadow-lg p-6 border border-pink-200">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Bugün aklında ne var?"
                        className="w-full border border-pink-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-pink-300 mb-4 resize-none bg-pink-50 text-pink-800 placeholder-pink-400"
                        rows="3"
                    />
                    <button
                        onClick={handlePublish}
                        className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold py-2 rounded-2xl hover:brightness-110 transition shadow-md"
                    >
                        {editingId ? "Kaydet" : "Yeni Yazı Yaz"}
                    </button>
                </div>
            </div>

            {/* GÜNLÜK LİSTESİ – ortalanmış kartlar, blog ile aynı alignment */}
            <div className="space-y-4 flex flex-col items-center">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="w-full max-w-md border border-pink-200 bg-pink-50 shadow-md rounded-2xl p-4 transition hover:shadow-xl hover:bg-pink-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-pink-300">
                                {new Date(post.createdAt).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="text-xs px-3 py-1 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 shadow-sm"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="text-xs px-3 py-1 rounded-xl bg-red-400 text-white hover:bg-red-500 shadow-sm"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>

                        <p className="text-pink-700 whitespace-pre-line">
                            {post.content}
                        </p>
                    </div>
                ))}
            </div>
        </PageLayout>
    );

}

export default GunlukPage;
