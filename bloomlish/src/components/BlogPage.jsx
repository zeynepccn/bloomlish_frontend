import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { Button, Input, List, Modal, message } from "antd";
import { HeartIcon } from "@heroicons/react/24/solid";

const { TextArea } = Input;

const API_BASE = import.meta.env.VITE_API_BASE;
const API_URL = `${API_BASE}/api/posts`;


function BlogPage() {
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const currentEmail = (localStorage.getItem("email") || "").toLowerCase();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [editText, setEditText] = useState("");



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${API_URL}/get-all?page=${page}&size=10`, {
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
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error(err));
    }, [page]);

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
    const handleEdit = (post) => {
        setEditPost(post);
        setEditText(post.content);
        setIsEditModalOpen(true);
    };
    const handleSaveEdit = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/update/${editPost.id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: editText }),
            });

            if (!res.ok) throw new Error("Post güncellenemedi");
            const updatedPost = await res.json();

            setPosts((prev) =>
                prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
            );

            setIsEditModalOpen(false);
            message.success("Post başarıyla güncellendi ");
        } catch (err) {
            console.error(err);
            message.error("Post güncellenemedi ");
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

            const updatedPost = await res.json();

            setPosts((prev) =>
                prev.map((post) =>
                    post.id === id ? updatedPost : post
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

    const handleDeleteComment = async (postId, commentId) => {
        Modal.confirm({
            title: "Emin misiniz?",
            content: "Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            okText: "Evet, sil",
            okType: "danger",
            cancelText: "Vazgeç",
            onOk: async () => {
                const token = localStorage.getItem("token");
                try {
                    const res = await fetch(`${API_BASE}/api/comments/delete/${commentId}`, {

                        method: "DELETE",
                        headers: { "Authorization": `Bearer ${token}` },
                    });
                    if (!res.ok) throw new Error("Yorum silinemedi");

                    setPosts((prev) =>
                        prev.map((post) =>
                            post.id === postId
                                ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) }
                                : post
                        )
                    );
                    message.success("Yorum başarıyla silindi ");
                } catch (err) {
                    console.error(err);
                    message.error("Yorum silinemedi ");
                }
            }
        });
    };

    // Yorum güncelleme
    const handleUpdateComment = async (postId, commentId, newText) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/comments/update/${commentId}`, 
 {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: newText }),
            });
            if (!res.ok) throw new Error("Yorum güncellenemedi");

            const updatedComment = await res.json();

            // UI'da yorumu güncelle
            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((c) =>
                                c.id === commentId ? updatedComment : c
                            ),
                        }
                        : post
                )
            );
        } catch (err) {
            console.error(err);
            message.error("Yorum güncellenemedi");
        }
    };

    return (
        <PageLayout title="BLOG YAZILARI">
            {/* Yeni post alanı */}
            <div className="w-full max-w-md bg-pink-50 rounded-3xl shadow-lg p-6 border border-pink-200 mx-auto mb-6">
                <p className="text-[#e01f82] mb-4 text-center font-medium">
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

            {/* Post listesi */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border border-pink-200 bg-pink-50 shadow-md rounded-2xl p-4 max-w-md mx-auto transition hover:shadow-xl hover:bg-pink-100"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-pink-600">{post.username}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-pink-300">
                                    {post.updatedAt
                                        ? `Düzenlendi: ${new Date(post.updatedAt).toLocaleString()}`
                                        : new Date(post.createdAt).toLocaleString()}
                                </span>
                                {post.username?.toLowerCase() === currentEmail && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Sil
                                        </button>
                                    </>
                                )}

                            </div>
                        </div>
                        <p className="text-pink-700 whitespace-pre-line mb-4">{post.content}</p>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => handleLike(post.id)}
                                className="flex items-center gap-1 transition"
                            >
                                <HeartIcon
                                    className={`w-6 h-6 ${post.likedUsers?.some(e => e.toLowerCase() === currentEmail)
                                        ? "text-red-500"
                                        : "text-gray-400"
                                        }`}
                                />
                                <span>{post.likes}</span>
                            </button>
                        </div>

                        <CommentSection
                            postId={post.id}
                            comments={post.comments}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            onUpdateComment={handleUpdateComment}
                        />
                    </div>
                ))}
            </div>

            {/* Sayfalama butonları → post listesinin dışında */}
            <div className="flex justify-center gap-2 mt-6">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 bg-pink-200 rounded disabled:opacity-50"
                >
                    Önceki
                </button>
                <span>{page + 1} / {totalPages}</span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-pink-200 rounded disabled:opacity-50"
                >
                    Sonraki
                </button>
            </div>
            <Modal
                title="Postu Düzenle"
                open={isEditModalOpen}
                onOk={handleSaveEdit}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Kaydet"
                cancelText="Vazgeç"
            >
                <Input.TextArea
                    rows={4}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                />
            </Modal>
        </PageLayout>
    );
}

function CommentSection({ postId, comments = [], onAddComment, onDeleteComment, onUpdateComment }) {
    const [commentText, setCommentText] = useState("");
    const [expandedCommentId, setExpandedCommentId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState("");

    const currentEmail = (localStorage.getItem("email") || "").toLowerCase();

    const handleSubmit = () => {
        if (!commentText.trim()) return;
        onAddComment(postId, commentText);
        setCommentText("");
    };

    const startEdit = (comment) => {
        setIsEditing(true);
        setEditText(comment.text);
        setExpandedCommentId(comment.id);
    };

    const saveEdit = (commentId) => {
        if (!editText.trim()) return;
        onUpdateComment(postId, commentId, editText); // parent fonksiyon çağrılır
        setIsEditing(false);
        setEditText("");
    };

    return (
        <div className="flex flex-col gap-2 w-full mt-2">
            {/* Yorum yazma alanı */}
            <div className="flex gap-2">
                <Input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorum yaz..."
                    className="!rounded-xl"
                />
                <Button
                    type="primary"
                    className="!bg-pink-500 !border-pink-500 !rounded-xl hover:!bg-pink-600"
                    onClick={handleSubmit}
                >
                    Gönder
                </Button>
            </div>

            {/* Yorum listesi */}
            {comments.length > 0 && (
                <List
                    size="small"
                    bordered
                    className="rounded-xl"
                    dataSource={comments}
                    renderItem={(c) => {
                        const isOwner = c.username?.toLowerCase() === currentEmail;
                        const isExpanded = expandedCommentId === c.id;

                        return (
                            <List.Item
                                key={c.id}
                                onClick={() => setExpandedCommentId(isExpanded ? null : c.id)}
                                className={`cursor-pointer transition-all duration-300 text-pink-700 text-sm ${isExpanded ? "bg-pink-50 p-4" : "p-2"
                                    }`}
                            >
                                <div className="flex flex-col w-full">
                                    {!isEditing || expandedCommentId !== c.id ? (
                                        <>
                                            <div>
                                                💬 <strong>@{c.username}</strong>: {c.text}
                                            </div>
                                            <span className="ml-2 text-xs text-gray-500">
                                                {c.updatedAt
                                                    ? `Düzenlendi: ${new Date(c.updatedAt).toLocaleString()}`
                                                    : new Date(c.createdAt).toLocaleString()}
                                            </span>
                                        </>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                value={editText}
                                                onClick={(e) => e.stopPropagation()} // expand kapatmasın
                                                onChange={(e) => setEditText(e.target.value)}
                                            />
                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    saveEdit(c.id);
                                                }}
                                            >
                                                Kaydet
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Vazgeç
                                            </Button>
                                        </div>
                                    )}

                                    {/* Yorum sahibi ise düzenle/sil */}
                                    {isOwner && isExpanded && !isEditing && (
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                size="small"
                                                type="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startEdit(c);
                                                }}
                                            >
                                                Düzenle
                                            </Button>
                                            <Button
                                                size="small"
                                                danger
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteComment(postId, c.id);
                                                }}
                                            >
                                                Sil
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </List.Item>
                        );
                    }}
                />
            )}
        </div>
    );
}

export default BlogPage;
