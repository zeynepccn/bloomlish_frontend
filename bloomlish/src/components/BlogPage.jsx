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
            <Card className="w-full max-w-2xl mx-auto bg-pink-50 mb-6">
                <p className="text-pink-600 mb-4 text-center font-medium">
                    Kendi kısa yazılarını paylaş. Favori gönderilerini beğen ve yorum yap,
                    eğlenerek dil öğren 💗🌸
                </p>

                <TextArea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Bugün aklında ne var?"
                    rows={3}
                    className="mb-4"
                />
                <Button type="primary" block onClick={handlePublish} style={{ backgroundColor: "#ec4899", borderColor: "#ec4899" }}>
                    Yayımla
                </Button>
            </Card>

            <div className="space-y-6">
                {posts.map((post) => (
                    <Card
                        key={post.id}
                        title={`@${post.username}`}
                        extra={<span className="text-sm text-pink-300">{post.date}</span>}
                        className="max-w-2xl mx-auto bg-pink-50"
                    >
                        <p className="text-pink-700 whitespace-pre-line mb-4">{post.content}</p>
                        <div className="flex items-center gap-4">
                            <Button type="link" onClick={() => handleLike(post.id)}>
                                ❤️ {post.likes}
                            </Button>

                            <CommentSection
                                postId={post.id}
                                comments={post.comments}
                                onAddComment={handleAddComment}
                            />
                        </div>
                    </Card>
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
