import React, { useState, useEffect } from "react";
// Gerekli ikonları içe aktarıyoruz
import { FaHeart, FaRegComment } from "react-icons/fa";

const BlogTab = () => {
    const [inputValue, setInputValue] = useState("");
    const [posts, setPosts] = useState([]);

    // ✅ Sayfa açılınca kayıtlı verileri al
    useEffect(() => {
        const saved = localStorage.getItem("posts");
        if (saved) setPosts(JSON.parse(saved));
    }, []);

    // ✅ Post değiştikçe kaydet
    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    const handlePublish = () => {
        if (inputValue.trim() === "") return;

        const newPost = {
            id: Date.now(),
            username: "kullanici", // @ işareti kartta eklenecek
            date: new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
            // GÖNDERİ METNİNİ SADECE CONTENT OLARAK ALIYORUZ (Görsele Uygun)
            title: "",
            content: inputValue.trim(),
            image: null,
            likes: 0,
            comments: 0,
        };

        // En yeni gönderiyi en üste ekle
        setPosts([newPost, ...posts]);
        setInputValue("");
    };

    return (
        // Max genişliği biraz daha artırıp ortalıyoruz
        <div className="max-w-xl mx-auto py-8 px-4">

            {/* Açıklama/Başlık Alanı */}
            <div className="text-center mb-6">
                <p className="text-gray-700 text-sm font-medium">
                    Kendi kısa yazılarını paylaş 👋 Favori gönderilerini beğen, yorum yap, eğlenerek dil öğren 💕
                </p>
            </div>

            {/* Gönderi Alanı (Giriş Kutusu ve Yayımla Düğmesi) */}
            <div className="flex gap-2 mb-8 border border-gray-300 p-2 rounded-xl shadow-sm">
                <input
                    type="text"
                    placeholder="Bir şeyler yaz..."
                    className="flex-1 rounded-lg px-3 py-2 text-base focus:outline-none placeholder-gray-500"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => { // Enter tuşu ile de yayımlama eklendi
                        if (e.key === 'Enter') handlePublish();
                    }}
                />
                <button
                    onClick={handlePublish}
                    className="bg-pink-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-pink-600 transition duration-200 disabled:opacity-50"
                    disabled={inputValue.trim() === ""}
                >
                    Yayımla
                </button>
            </div>

            {/* GÖNDERİ KARTLARI LİSTESİ */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        // Minimalist Kart Stili
                        className="bg-white border border-gray-300 rounded-xl shadow-sm p-5 w-full"
                    >
                        {/* Üst Kısım: Kullanıcı ve Tarih */}
                        <header className="flex items-center justify-between text-sm mb-3">
                            {/* Kullanıcı Adı */}
                            <span className="font-bold text-gray-800">@{post.username}</span>

                            {/* Tarih */}
                            <time className="text-xs text-gray-500">{post.date}</time>
                        </header>

                        {/* İçerik Alanı */}
                        <main className="pb-3">
                            {/* Sadece içerik metni */}
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                {post.content}
                            </p>
                        </main>

                        {/* Alt Kısım: Etkileşimler (Beğeni ve Yorum) */}
                        <footer className="flex justify-start gap-5 text-gray-500 text-sm border-t border-gray-100 pt-3">
                            {/* Beğeni Sayısı */}
                            <span
                                className="flex items-center gap-1.5 cursor-pointer hover:text-red-500 transition duration-150"
                                title="Beğen"
                            >
                                <FaHeart className="text-base" /> {post.likes}
                            </span>

                            {/* Yorum Sayısı */}
                            <span
                                className="flex items-center gap-1.5 cursor-pointer hover:text-blue-500 transition duration-150"
                                title="Yorumlar"
                            >
                                <FaRegComment className="text-base" /> {post.comments}
                            </span>
                        </footer>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default BlogTab;