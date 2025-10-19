import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { Button, Input, Card, List } from "antd";
const { TextArea } = Input;

function BlogPage() {
    const username = "Zeynep";
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
    }, []);

    const handlePublish = async () => {
        if (text.trim() === "") return;

        const newPost = { username, content: text };

        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            });
            const savedPost = await res.json();
            setPosts([savedPost, ...posts]);
            setText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleLike = async (id) => {
        try {
            const res = await fetch(`/api/posts/${id}/like`, { method: "PATCH" });
            const updatedPost = await res.json();
            setPosts((prev) =>
                prev.map((post) => (post.id === id ? updatedPost : post))
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (id, commentText) => {
        if (commentText.trim() === "") return;

        try {
            const res = await fetch(`/api/posts/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment: commentText }),
            });
            const updatedPost = await res.json();
            setPosts((prev) =>
                prev.map((post) => (post.id === id ? updatedPost : post))
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <PageLayout title="GÜNLÜK YAZILAR">
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
                            <span className="text-sm text-pink-300">{post.date}</span>
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

function CommentSection({ postId, comments, onAddComment }) {
    const [commentText, setCommentText] = useState("");

    const handleSubmit = () => {
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
                    renderItem={(c) => <List.Item>💬 {c}</List.Item>}
                />
            )}
        </div>
    );
}

export default BlogPage;
