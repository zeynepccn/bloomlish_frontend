import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function QuizPage() {
    const navigate = useNavigate();

    // Dummy state
    const [lastResult] = useState({
        score: 85,
        level: "Orta",
        date: "10 Nisan 2025",
        correct: 24,
        wrong: 8,
    });

    const [testType, setTestType] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [duration, setDuration] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState(null);

    const handleStart = () => {
        if (!testType || !difficulty || !duration) {
            alert("Lütfen tüm seçenekleri doldur!");
            return;
        }
        navigate("/quiz", {
            state: { testType, difficulty, duration },
        });
    };

    const handleAiSuggestion = () => {
        const suggestions = [
            { testType: "Kelime Bilgisi", difficulty: "Orta", duration: "5dk" },
            { testType: "Dilbilgisi", difficulty: "Başlangıç", duration: "10dk" },
            { testType: "Okuma Anlama", difficulty: "İleri", duration: "15dk" },
        ];
        const random = suggestions[Math.floor(Math.random() * suggestions.length)];
        setAiSuggestion(random);

        setTestType(random.testType.toLowerCase());
        setDifficulty(random.difficulty);
        setDuration(random.duration);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 space-y-8">
            {/* Üst Başlık */}
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Seviye Belirleme Testi</h1>
                <p className="text-gray-600 mb-4">
                    Yapay zeka destekli sistemimizle seviyeni belirle, sana özel içeriklere ulaş 💜
                </p>
                <button
                    onClick={() => navigate("/quiz")}
                    className="bg-blue-200 px-6 py-2 rounded-lg text-lg font-medium shadow hover:bg-blue-300 transition"
                >
                    Testi Başlat
                </button>
            </div>

            {/* Sonuçlarım + Test İstatistikleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                <div className="p-6 bg-white rounded-2xl shadow-lg border text-center">
                    <h2 className="font-semibold mb-3 text-lg">Sonuçlarım</h2>
                    <p className="text-4xl font-extrabold text-pink-500">{lastResult.score}</p>
                    <p className="mt-1">Seviyen: <span className="font-medium">{lastResult.level}</span></p>
                    <p className="text-sm text-gray-500">Tarih: {lastResult.date}</p>
                </div>

                <div className="p-6 bg-white rounded-2xl shadow-lg border">
                    <h2 className="font-semibold mb-3 text-lg text-center">Test İstatistikleri</h2>
                    <div className="flex justify-between px-4">
                        <span>✅ Doğru: {lastResult.correct}</span>
                        <span>❌ Yanlış: {lastResult.wrong}</span>
                    </div>
                    <div className="mt-4 h-24 flex items-center justify-center border rounded bg-gray-100 text-gray-400">
                        [ Grafik Alanı ]
                    </div>
                </div>
            </div>

            {/* Yeni Quiz Başlat + AI Destekli Öneri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* Yeni Quiz Başlat */}
                <div className="p-6 bg-white rounded-2xl shadow-lg border">
                    <h2 className="font-semibold mb-4 text-lg text-center">Yeni Quiz Başlat</h2>

                    <label className="block mb-2 font-medium">Test Türü</label>
                    <select
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                        className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-pink-400"
                    >
                        <option value="">Seçiniz</option>
                        <option value="kelime">Kelime Bilgisi</option>
                        <option value="dilbilgisi">Dilbilgisi</option>
                        <option value="okuma">Okuma Anlama</option>
                        <option value="dinleme">Dinleme Anlama</option>
                        <option value="yazim">Yazım/Dikte</option>
                        <option value="karisik">Karışık Quiz</option>
                    </select>

                    <label className="block mb-2 font-medium">Zorluk Seviyesi</label>
                    <div className="flex gap-2 mb-4">
                        {["Başlangıç", "Orta", "İleri"].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`px-3 py-1 rounded-lg border transition ${difficulty === level ? "bg-pink-200 border-pink-400" : "hover:bg-gray-100"
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    <label className="block mb-2 font-medium">Süre</label>
                    <div className="flex gap-2 mb-4">
                        {["5dk", "10dk", "15dk"].map((time) => (
                            <button
                                key={time}
                                onClick={() => setDuration(time)}
                                className={`px-3 py-1 rounded-lg border transition ${duration === time ? "bg-pink-200 border-pink-400" : "hover:bg-gray-100"
                                    }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition shadow"
                    >
                        Başlat
                    </button>
                </div>

                {/* AI Destekli Öneri */}
                <div className="p-6 bg-white rounded-2xl shadow-lg border">
                    <h2 className="font-semibold mb-2 text-lg text-center">AI Destekli Öneri</h2>
                    <p className="text-sm mb-3 text-gray-600 text-center">
                        Yapay zekâ önceki sonuçlarına göre sana uygun test önerebilir.
                    </p>
                    <button
                        onClick={handleAiSuggestion}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition shadow"
                    >
                        Test Önerisi Al
                    </button>

                    {aiSuggestion && (
                        <div className="mt-4 text-sm bg-gray-50 p-3 rounded border">
                            <p><strong>Test Türü:</strong> {aiSuggestion.testType}</p>
                            <p><strong>Zorluk:</strong> {aiSuggestion.difficulty}</p>
                            <p><strong>Süre:</strong> {aiSuggestion.duration}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


export default QuizPage;

