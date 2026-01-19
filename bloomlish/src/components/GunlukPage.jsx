import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { Modal, message } from "antd";
import api from "../api";

function GunlukPage() {
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem("token");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/api/notes/get-all");
                setPosts(res.data.content || []);
            } catch (err) {
                console.error(err);
                message.error("Diary entries could not be received ");
            }
        };

        fetchNotes();
    }, []);


    const handlePublish = async () => {
        if (text.trim() === "") return;

        try {
            if (editingId) {
                const res = await api.put(`/api/notes/update/${editingId}`, {
                    content: text
                });
                const updatedPost = res.data;
                setPosts((prev) =>
                    prev.map((p) => (p.id === editingId ? updatedPost : p))
                );
                setEditingId(null);
                setText("");
                message.success("Daily updated ");
            } else {
                const res = await api.post("/api/notes/create", { content: text });
                const savedPost = res.data;

                setPosts((prev) => [savedPost, ...prev]);
                setText("");
                message.success("Daily added ");
            }
        } catch (err) {
            console.error(err);
            message.error("Daily could not be saved ");
        }
    };
    const handleEdit = (post) => {
        setEditingId(post.id);
        setText(post.content);
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Are you sure you want to delete this diary entry? This action cannot be undone.",
            okText: "Yes, delete",
            okType: "danger",
            cancelText: "Give up",
            onOk: async () => {
                try {
                    await api.delete(`/api/notes/delete/${id}`);
                    setPosts((prev) => prev.filter((p) => p.id !== id));
                    message.success("The post was deleted ");
                } catch (err) {
                    console.error(err);
                    message.error("The post could not be deleted ");
                }
            }
        });
    };

    return (
        <PageLayout title="DAILY ARTICLES">
            <div className="w-full flex justify-center mb-8">
                <div className="w-full max-w-md bg-pink-50 rounded-3xl shadow-lg p-6 border border-pink-200">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind today?"
                        className="w-full border border-pink-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-pink-300 mb-4 resize-none bg-pink-50 text-pink-800 placeholder-pink-400"
                        rows="3"
                    />
                    <button
                        onClick={handlePublish}
                        className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-semibold py-2 rounded-2xl hover:brightness-110 transition shadow-md"
                    >
                        {editingId ? "Save" : "Write New Post"}
                    </button>
                </div>
            </div>

            {/* DAILY LIST – centered cards, same alignment as blog */}
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
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="text-xs px-3 py-1 rounded-xl bg-red-400 text-white hover:bg-red-500 shadow-sm"
                                >
                                    Delete
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
