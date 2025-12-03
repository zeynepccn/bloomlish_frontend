import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function QuizPage() {
    const navigate = useNavigate();

    const [testType, setTestType] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [questionCount, setQuestionCount] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState(null);

    const handleStart = async () => {
        if (!testType || !difficulty || !questionCount) {
            alert("Lütfen tüm seçenekleri doldur!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            console.log("Token:", token);

            let url = "http://localhost:8080/api/quiz/start";
            let params = {
                testType,
                difficulty,
                limit: questionCount,
            };

            // 🔊 Eğer dinleme ise farklı endpoint ve farklı response bekliyoruz
            const isListening = testType === "dinleme";
            if (isListening) {
                url = "http://localhost:8080/api/quiz/start/listening";
                params = {
                    difficulty,
                    limit: questionCount,
                };
            }
            console.log("Gittiği URL:", url);
            console.log("Params:", params);


            const res = await axios.get(url, {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = res.data;
            console.log("GELEN VERİ:", data);

            if (isListening) {
                // listening için gruplanmış data
                navigate("/quiz-questions", {
                    state: {
                        listeningData: data,
                        testType,
                        difficulty,
                    },
                });
            } else {
                // normal quizler
                navigate("/quiz-questions", {
                    state: {
                        questions: data,
                        testType,
                        difficulty,
                    },
                });
            }
        } catch (err) {
            console.error(err);
            alert("Quiz başlatılamadı. Sunucu hatası veya ağ problemi olabilir.");
        }

    };


    const handleAiSuggestion = () => {
        const suggestions = [
            { testType: "Kelime Bilgisi", difficulty: "Medium", duration: "5dk" },
            { testType: "Dilbilgisi", difficulty: "Easy", duration: "10dk" },
            { testType: "Okuma Anlama", difficulty: "Hard", duration: "15dk" },
        ];
        const random = suggestions[Math.floor(Math.random() * suggestions.length)];
        setAiSuggestion(random);

        const lowerType =
            random.testType === "Kelime Bilgisi"
                ? "kelime"
                : random.testType === "Dilbilgisi"
                    ? "dilbilgisi"
                    : random.testType === "Okuma Anlama"
                        ? "okuma"
                        : "kelime";

        setTestType(lowerType);
        setDifficulty(random.difficulty);
        setQuestionCount(
            random.duration === "5dk"
                ? 5
                : random.duration === "10dk"
                    ? 10
                    : 15
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 space-y-8">
            {/* Üst Başlık */}
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Seviye Belirleme Testi</h1>
                <p className="text-gray-600 mb-4">
                    Yapay zeka destekli sistemimizle seviyeni belirle, sana özel
                    içeriklere ulaş 💜
                </p>

                <div className="flex flex-col md:flex-row gap-3 justify-center">
                    <button
                        onClick={handleStart}
                        className="bg-blue-200 px-6 py-2 rounded-lg text-lg font-medium shadow hover:bg-blue-300 transition"
                    >
                        Testi Başlat
                    </button>

                    <button
                        onClick={() => navigate("/results")}
                        className="bg-white border px-6 py-2 rounded-lg text-sm font-medium shadow hover:bg-gray-100 transition"
                    >
                        Sonuçlarımı Gör
                    </button>
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
                        {["Easy", "Medium", "Hard"].map((level) => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`px-3 py-1 rounded-lg border transition ${difficulty === level
                                    ? "bg-pink-200 border-pink-400"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>

                    <label className="block mb-2 font-medium">Soru Sayısı</label>
                    <div className="flex gap-2 mb-4">
                        {[5, 10, 15].map((count) => (
                            <button
                                key={count}
                                onClick={() => setQuestionCount(count)}
                                className={`px-3 py-1 rounded-lg border transition ${questionCount === count
                                    ? "bg-pink-200 border-pink-400"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {count} Soru
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
                            <p>
                                <strong>Test Türü:</strong> {aiSuggestion.testType}</p>
                            <p>
                                <strong>Zorluk:</strong> {aiSuggestion.difficulty}</p>
                            <p>
                                <strong>Süre:</strong> {aiSuggestion.duration}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuizPage;
