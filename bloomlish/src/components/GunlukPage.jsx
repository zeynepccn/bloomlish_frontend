import React, { useState, useEffect } from "react";
import PageLayout from "./PageLayout";
import { UserIcon } from "@heroicons/react/24/solid";

import { useNavigate } from "react-router-dom";
function GunlukPage() {
    const navigate = useNavigate();
    const username = "Zeynep";
    const [text, setText] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/gunluk")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
    }, []);

    const handlePublish = async () => {
        if (text.trim() === "") return;

        const newPost = { username, content: text };

        try {
            const res = await fetch("http://localhost:5000/gunluk", {
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
    const handleUserClick = (username) => {
        navigate(`/profile/${username}`);
    };


    return (
        <PageLayout title="GÜNLÜK YAZILAR">
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
                    className="w-full bg-pink-400 text-white font-semibold py-2 rounded-2xl hover:bg-pink-500 transition mb-6 shadow-md"
                >
                    Yeni Yazı Yaz
                </button>

                <div className="space-y-4">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="border border-pink-200 bg-pink-50 shadow-md rounded-2xl p-4 transition hover:shadow-xl hover:bg-pink-100"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:text-pink-600 transition"
                                    onClick={() => handleUserClick(post.username)}
                                >
                                    <UserIcon className="h-5 w-5 text-pink-600" />
                                    <span className="text-sm text-pink-600">@{post.username}</span>
                                </div>


                                <span className="text-sm text-pink-300">{post.date}</span>
                            </div>
                            <p className="text-pink-700 whitespace-pre-line">{post.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
}

export default GunlukPage;
