import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { Button, Input, List, Modal, message } from "antd";
import { TrashIcon } from "@heroicons/react/24/solid";
const { TextArea } = Input;


const API_URL = "http://localhost:8080/api/posts";
function BlogPage() {
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        fetch(`${API_URL}/get-all?page=0&size=10`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Postlar alınamadı");
                return res.json();
            })
            .then((data) => {
                setPosts(data.content);
            })
            .catch((err) => console.error(err));
    }, []);

    const handlePublish = async () => {
        if (text.trim() === "") return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/create`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: text }),
            });
            if (!res.ok) throw new Error("Post oluşturulamadı");
            const savedPost = await res.json();

            setPosts([savedPost, ...posts]);
            setText("");
        } catch (err) {
            console.error(err);
        }
    };
    const handleDelete = (id) => {
        Modal.confirm({
            title: "Emin misiniz?",
            content: "Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            okText: "Evet, sil",
            okType: "danger",
            cancelText: "Vazgeç",
            onOk: async () => {
                const token = localStorage.getItem("token");
                try {
                    const res = await fetch(`${API_URL}/delete/${id}`, {
                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` }
                    });
                    if (res.ok) {
                        setPosts((prev) => prev.filter((post) => post.id !== id));
                    } else {
                        throw new Error("Post silinemedi");
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        });
    };


    const handleLike = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/${id}/like`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                }

            });
            if (!res.ok) {
                const errorText = await res.text();
                message.warning(errorText || "Beğeni hatası");
                return;
            }
            const newLikes = await res.json();

            setPosts((prev) =>
                prev.map((post) =>
                    post.id === id ? { ...post, likes: newLikes } : post
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (id, commentText) => {
        if (commentText.trim() === "") return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/${id}/comment`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: commentText }),
            });
            if (!res.ok) throw new Error("Yorum eklenemedi");
            const newComment = await res.json();
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === id
                        ? { ...post, comments: [...(post.comments || []), newComment] }
                        : post
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <PageLayout title="BLOG YAZILARI">
            <div className="w-full max-w-md bg-pink-50 rounded-3xl shadow-lg p-6 border border-pink-200 mx-auto mb-6">
                <p className="text-white drop-shadow-[0_0_3px_#ec4899] mb-4 text-center font-medium">
                    Kendi kısa yazılarını paylaş. Favori gönderilerini beğen ve yorum yap,
                    eğlenerek dil öğren 💗🌸
                </p>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Bugün aklında ne var?"
                    className="w-full border border-pink-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-pink-300 mb-4 resize-none bg-pink-50 text-pink-800 placeholder-pink-400"
                    rows="3"
                />

                <button
                    onClick={handlePublish}
                    className="w-full bg-pink-400 text-white font-semibold py-2 rounded-2xl hover:bg-pink-500 transition shadow-md"
                >
                    Yayımla
                </button>
            </div>

            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border border-pink-200 bg-pink-50 shadow-md rounded-2xl p-4 max-w-md mx-auto transition hover:shadow-xl hover:bg-pink-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-pink-600">@{post.username}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-pink-300">
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                                <button onClick={() => handleDelete(post.id)}>
                                    <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                                </button>

                            </div>
                        </div>
                        <p className="text-pink-700 whitespace-pre-line mb-4">{post.content}</p>

                        <div className="flex items-center gap-4">
                            <button
                                className="text-pink-500 hover:text-pink-600 transition"
                                onClick={() => handleLike(post.id)}
                            >
                                ❤️ {post.likes}
                            </button>

                            <CommentSection
                                postId={post.id}
                                comments={post.comments}
                                onAddComment={handleAddComment}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </PageLayout>
    );
}

function CommentSection({ postId, comments = [], onAddComment }) {
    const [commentText, setCommentText] = useState("");

    const handleSubmit = () => {
        if (!commentText.trim()) return;
        onAddComment(postId, commentText);
        setCommentText("");
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2">
                <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorum yaz..."
                />
                <Button type="primary" onClick={handleSubmit}>
                    Gönder
                </Button>
            </div>

            {comments.length > 0 && (
                <List
                    size="small"
                    bordered
                    dataSource={comments}
                    renderItem={(c) => (
                        <List.Item key={c.id}>
                            💬 <strong>@{c.username}</strong>: {c.text}
                            <span style={{ marginLeft: "8px", fontSize: "0.8em", color: "#999" }}>
                                {new Date(c.createdAt).toLocaleString()}
                            </span>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
}

export default BlogPage;
