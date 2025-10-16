import React, { useState } from "react";
import Navbar from "../component/Navbar";

import ing1 from "../assets/images/ing1.jpg";
import ing2 from "../assets/images/ing2.jpg";
import ing3 from "../assets/images/ing3.jpg";
import ing4 from "../assets/images/ing4.jpg";


function HomePage() {

    const images = [ing1, ing2, ing3, ing4];
    const [current, setCurrent] = useState(0);

    const prevSlide = () => {
        setCurrent(current === 0 ? images.length - 1 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === images.length - 1 ? 0 : current + 1);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
          
            {/* Hero Section */}
            <section className="text-center  mb-16">
                <h2 className="text-2xl md:text-3xl font-semibold text-pink-300 mb-2">
                    BLOOMLISH İLE İNGİLİZCE ÖĞRENMEK ARTIK ÇOK EĞLENCELİ 💖🌸✨
                </h2>
                <p className="text-gray-500 mb-6">
                    Kendi hızında ilerle, oyunlar ve testlerle gelişimini takip edelim!
                </p>
                <div className="flex gap-4 justify-center">
                    <button className="border border-gray-400 px-6 py-2 rounded-md hover:bg-pink-50">
                        Hemen Başla
                    </button>
                    <button className="border border-gray-400 px-6 py-2 rounded-md hover:bg-pink-50">
                        Ücretsiz Deneme
                    </button>
                </div>
            </section>

            {/* Özellik Kartları */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-10 mb-20">
                {[
                    {
                        title: "KİŞİSELLEŞTİRİLMİŞ DERSLER!",
                        desc: "Öğrenci seviyelerine göre kişiselleştirilmiş dersler 📍",
                        icon: "📘",
                    },
                    {
                        title: "YAPAY ZEKA DESTEKLİ TESTLER!",
                        desc: "Öğrenci seviyelerini analiz eden yapay zeka 📍",
                        icon: "🤖",
                    },
                    {
                        title: "GÖRÜNTÜLÜ DERS VE GRUP SOHBETİ!",
                        desc: "Canlı dersler ve grup sohbetleri 📍",
                        icon: "💬",
                    },
                    {
                        title: "OYUNLAR VE ETKİLEŞİMLİ İÇERİKLER!",
                        desc: "Eğlenceli ve interaktif içerikler 📍",
                        icon: "🎮",
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="border border-blue-200 p-6 rounded-lg text-center hover:shadow-md transition-shadow"
                    >
                        <div className="text-4xl mb-3">{item.icon}</div>
                        <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* Kaydırmalı Resim Alanı */}
            
                <div className="relative w-full max-w-7xl mx-auto mt-10">
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
