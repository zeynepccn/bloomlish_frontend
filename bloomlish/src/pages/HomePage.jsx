import React, { useState } from "react";
import { FaBookOpen, FaBrain, FaVideo, FaGamepad, FaPenFancy } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ing1 from "../assets/images/ing1.jpg";
import ing2 from "../assets/images/ing2.jpg";
import ing3 from "../assets/images/ing3.jpg";
import ing4 from "../assets/images/ing4.jpg";

// 🔹 isLoggedIn artık props'tan geliyor
function HomePage({ isLoggedIn }) {
    const images = [ing1, ing2, ing3, ing4];
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleStart = () => {
        navigate("/start");
    };

    const features = [
        {
            title: "DERSLER!",
            desc: "Öğrenci seviyelerine göre dersler",
            icon: <FaBookOpen className="text-blue-600 text-4xl mx-auto mb-3" />,
        },
        {
            title: "YAPAY ZEKA DESTEKLİ TESTLER!",
            desc: "Öğrenci seviyelerini analiz eden yapay zeka",
            icon: <FaBrain className="text-purple-600 text-4xl mx-auto mb-3" />,
        },
        {
            title: "GÖRÜNTÜLÜ DERS VE GRUP SOHBETİ!",
            desc: "Canlı dersler ve grup sohbetleri",
            icon: <FaVideo className="text-pink-500 text-4xl mx-auto mb-3" />,
        },
        {
            title: "OYUNLAR VE ETKİLEŞİMLİ İÇERİKLER!",
            desc: "Eğlenceli ve interaktif içerikler",
            icon: <FaGamepad className="text-green-500 text-4xl mx-auto mb-3" />,
        },
        {
            title: "YAZILAR!",
            desc: "Okuma becerini geliştirecek kısa yazılar",
            icon: <FaPenFancy className="text-yellow-500 text-4xl mx-auto mb-3" />,
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
            {/* Hero */}
            <section className="text-center mt-28 mb-16 px-4">
                <h2 className="text-2xl md:text-3xl font-semibold text-pink-400 mb-2">
                    BLOOMLISH İLE İNGİLİZCE ÖĞRENMEK ARTIK ÇOK EĞLENCELİ 💖🌸✨
                </h2>
                <p className="text-gray-500 mb-6">
                    Kendi hızında ilerle, oyunlar ve testlerle gelişimini takip edelim!
                </p>

                {/* Sadece login OLMAMIŞSA göster */}
                {!isLoggedIn && (
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleStart}
                            className="border border-gray-400 px-6 py-2 rounded-md hover:bg-pink-50 transition"
                        >
                            Hemen Başla
                        </button>
                        <button className="border border-gray-400 px-6 py-2 rounded-md hover:bg-pink-50 transition">
                            Ücretsiz Deneme
                        </button>
                    </div>
                )}
            </section>

            {/* Özellik kartları */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-10 mb-20">
                {features.map((item, i) => (
                    <div
                        key={i}
                        className={`border border-pink-200 p-6 rounded-lg text-center shadow-sm bg-white flex flex-col transition-shadow ${isLoggedIn ? "hover:shadow-lg cursor-pointer" : "opacity-80"
                            }`}
                    >
                        {/* Icon */}
                        {item.icon}

                        {/* Metin alanı (esneyebilir) */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-2 text-gray-700">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">{item.desc}</p>
                        </div>

                        {/* Buton (her zaman altta, sadece login ise) */}
                        {isLoggedIn && (
                            <button
                                onClick={() => {
                                    if (item.title === "DERSLER!") {
                                        navigate("/lessons");
                                    } else if (item.title === "YAZILAR!") {
                                        navigate("/blog");
                                    } else if (item.title === "YAPAY ZEKA DESTEKLİ TESTLER!") {
                                        navigate("/quiz");
                                    } else if (item.title === "OYUNLAR VE ETKİLEŞİMLİ İÇERİKLER!") {
                                        navigate("/games");
                                    } else {
                                        console.log(`${item.title} yakında eklenecek ✨`);
                                    }
                                }}
                                className="w-full text-sm border border-gray-300 rounded-md py-1 hover:bg-pink-50 transition"
                            >
                                Keşfet ✨
                            </button>
                        )}
                    </div>
                ))}
            </section>

            {/* Kaydırmalı resim alanı */}
            <div className="relative w-full max-w-7xl mx-auto mt-10 mb-10 px-4">
                <img
                    src={images[current]}
                    alt={`Slide ${current + 1}`}
                    className="w-full h-80 object-cover rounded-lg shadow-md"
                />

                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                    ▶
                </button>
            </div>
        </div>
    );
}

export default HomePage;
