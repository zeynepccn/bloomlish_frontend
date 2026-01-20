import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { Button, Input, List, Modal, message } from "antd";
import { HeartIcon } from "@heroicons/react/24/solid";
import api from "../api";

const { TextArea } = Input;

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

        const fetchPosts = async () => {
            try {
                const res = await api.get("/api/posts/get-all", {
                    params: { page, size: 10 },
                });
                setPosts(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error(err);
                message.error("The post could not be received ");
            }
        };

        fetchPosts();
    }, [page]);

    const handlePublish = async () => {
        if (text.trim() === "") return;
        try {
            const res = await api.post("/api/posts/create", { content: text });
            const savedPost = res.data;

            setPosts((prev) => [savedPost, ...prev]);
            setText("");
            message.success("The post was shared");
        } catch (err) {
            console.error(err);
            message.error("The post could not be created ");
        }
    };
    const handleEdit = (post) => {
        setEditPost(post);
        setEditText(post.content);
        setIsEditModalOpen(true);
    };
    const handleSaveEdit = async () => {
        try {
            const res = await api.put(`/api/posts/update/${editPost.id}`, {
                content: editText,
            });

            const updatedPost = res.data;

            setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
            setIsEditModalOpen(false);
            message.success("The post has been successfully updated ");
        } catch (err) {
            console.error(err);
            message.error("The post could not be updated");
        }
    };
    const handleDelete = (id) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Are you sure you want to delete this post? This action cannot be undone.",
            okText: "Yes,delete",
            okType: "danger",
            cancelText: "Give up",
            onOk: async () => {
                try {
                    await api.delete(`/api/posts/delete/${id}`);
                    setPosts((prev) => prev.filter((post) => post.id !== id));
                    message.success("the post was deleted ");
                } catch (err) {
                    console.error(err);
                    message.error("the post could not be deleted");
                }
            },
        });
    };


    const handleLike = async (id) => {
        try {
            const res = await api.patch(`/api/posts/${id}/like`);
            const updatedPost = res.data;

            setPosts((prev) => prev.map((post) => (post.id === id ? updatedPost : post)));
        } catch (err) {
            console.error(err);
            message.warning("You cannot like your own post ");
        }
    };

    const handleAddComment = async (id, commentText) => {
        if (commentText.trim() === "") return;

        try {
            const res = await api.post(`/api/posts/${id}/comment`, { text: commentText });
            const newComment = res.data;

            setPosts((prev) =>
                prev.map((post) =>
                    post.id === id ? { ...post, comments: [...(post.comments || []), newComment] } : post
                )
            );
        } catch (err) {
            console.error(err);
            message.error("comment could not be added ");
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        Modal.confirm({
            title: "Are you sure?",
            content: "Are you sure you want to delete this comment? This action cannot be undone.",
            okText: "Yes,delete",
            okType: "danger",
            cancelText: "Give up",
            onOk: async () => {
                try {
                    await api.delete(`/api/comments/delete/${commentId}`);

                    setPosts((prev) =>
                        prev.map((post) =>
                            post.id === postId
                                ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) }
                                : post
                        )
                    );
                    message.success("the comment was successfully deleted ");
                } catch (err) {
                    console.error(err);
                    message.error("the comment could not be deleted ");
                }
            },
        });
    };

    const handleUpdateComment = async (postId, commentId, newText) => {
        try {
            const res = await api.put(`/api/comments/update/${commentId}`, { text: newText });
            const updatedComment = res.data;

            setPosts((prev) =>
                prev.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            comments: post.comments.map((c) => (c.id === commentId ? updatedComment : c)),
                        }
                        : post
                )
            );
            message.success("the comment has been updated ");
        } catch (err) {
            console.error(err);
            message.error("the comment could not be updated ");
        }
    };


    return (
        <PageLayout title="BLOG POSTS">
            {/* Yeni post alanı */}
            <div className="w-full max-w-md bg-pink-50 rounded-3xl shadow-lg p-6 border border-pink-200 mx-auto mb-6">
                <p className="text-[#e01f82] mb-4 text-center font-medium">
                    Share your own short writings. Like and comment on your favorite posts, learn a language while having fun 💗🌸
                </p>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's on your mind today?"
                    className="w-full border border-pink-300 rounded-2xl p-3 outline-none focus:ring-2 focus:ring-pink-300 mb-4 resize-none bg-pink-50 text-pink-800 placeholder-pink-400"
                    rows="3"
                />
                <button
                    onClick={handlePublish}
                    className="w-full bg-pink-400 text-white font-semibold py-2 rounded-2xl hover:bg-pink-500 transition shadow-md"
                >
                    Publish
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
                                        ? `Edited: ${new Date(post.updatedAt).toLocaleString()}`
                                        : new Date(post.createdAt).toLocaleString()}
                                </span>
                                {post.username?.toLowerCase() === currentEmail && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Delete
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
                    Previous
                </button>
                <span>{page + 1} / {totalPages}</span>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 bg-pink-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <Modal
                title="Edit the post"
                open={isEditModalOpen}
                onOk={handleSaveEdit}
                onCancel={() => setIsEditModalOpen(false)}
                okText="Save"
                cancelText="Cancel"
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
                    placeholder="write a review..."
                    className="!rounded-xl"
                />
                <Button
                    type="primary"
                    className="!bg-pink-500 !border-pink-500 !rounded-xl hover:!bg-pink-600"
                    onClick={handleSubmit}
                >
                    Send
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
                                                <strong>@{c.username}</strong>: {c.text}
                                            </div>
                                            <span className="ml-2 text-xs text-gray-500">
                                                {c.updatedAt
                                                    ? `Edited: ${new Date(c.updatedAt).toLocaleString()}`
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
                                                Save
                                            </Button>
                                            <Button
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Give up
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
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                danger
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteComment(postId, c.id);
                                                }}
                                            >
                                                Delete
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