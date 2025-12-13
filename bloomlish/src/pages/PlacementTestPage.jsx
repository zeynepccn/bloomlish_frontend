import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";


function PlacementTestPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [estimatedLevel, setEstimatedLevel] = useState(null);
    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState({}); // { [questionId]: "seçenek" }
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);


    useEffect(() => {
        const fetchPlacementTest = async () => {
            try {
                const res = await api.get(
                    "/api/placement/start",
                );

                console.log("PLACEMENT START RESPONSE:", res.data);

                setEstimatedLevel(res.data.estimatedLevel);
                setQuestions(res.data.questions || []);
                setError(null);
            } catch (err) {
                console.error("Placement testi başlatılamadı:", err);
                setError(
                    "Seviye belirleme testi başlatılırken bir hata oluştu. Lütfen daha sonra tekrar dene."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPlacementTest();
    }, []);

    const handleOptionChange = (questionId, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleSubmit = async () => {
        if (!questions.length) return;

        // Tüm sorulara cevap verildi mi kontrol edelim
        const unanswered = questions.filter(
            (q) => !answers[q.id]
        );
        if (unanswered.length > 0) {
            alert("Lütfen tüm soruları cevapla 📝");
            return;
        }

        const token = localStorage.getItem("token");
        const payload = {
            answers: answers,

        };

        console.log("PLACEMENT SUBMIT PAYLOAD:", payload);

        try {
            setSubmitting(true);
            const res = await api.post(
                "/api/placement/submit",
                payload,
            );

            console.log("PLACEMENT RESULT:", res.data);
            setResult(res.data);
        } catch (err) {
            console.error("Placement test sonucu gönderilemedi:", err);
            alert("Sonuçlar gönderilirken bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white px-6 py-4 rounded-2xl shadow">
                    Yükleniyor...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white px-6 py-4 rounded-2xl shadow text-center">
                    <p className="text-red-600 mb-3">{error}</p>
                    <button
                        onClick={() => navigate("/quiz")}
                        className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
                    >
                        Quiz Sayfasına Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 space-y-6">
            {/* Üst başlık + tahmini seviye */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 mb-2">
                <button
                    onClick={() => navigate("/quiz")}
                    className="text-xs text-blue-600 hover:underline mb-3"
                >
                    ← Quiz sayfasına dön
                </button>

                <h1 className="text-2xl font-bold mb-2">
                    Seviye Belirleme Testi
                </h1>
                <p className="text-gray-600 mb-3">
                    Bu test, daha önce çözdüğün quizlere ve başarı durumuna göre sana
                    özel hazırlandı. Tüm soruları samimi şekilde cevapla, sana en uygun
                    seviyeyi belirleyelim 💜
                </p>

                {estimatedLevel && (
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold">Tahmini seviyen:</span>{" "}
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold ml-1">
                            {estimatedLevel}
                        </span>
                        <span className="text-gray-500 ml-2">
                        </span>
                    </p>
                )}
            </div>

            {/* Sonuç kartı (test gönderildiyse) */}
            {result && (
                <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 border border-purple-200">
                    <h2 className="text-lg font-semibold mb-2">
                        Seviye Belirleme Sonucun 🎉
                    </h2>
                    <p className="mb-1">
                        <span className="font-medium">Nihai seviyen:</span>{" "}
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold ml-1">
                            {result.finalLevel}
                        </span>
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                        Doğru sayısı:{" "}
                        <span className="font-semibold">
                            {result.totalCorrect} / {result.totalQuestions}
                        </span>
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                        Genel başarı oranı:{" "}
                        <span className="font-semibold">
                            {(result.overallCorrectRate * 100).toFixed(0)}%
                        </span>
                    </p>

                    <button
                        onClick={() => navigate("/quiz")}
                        className="mt-2 px-4 py-2 rounded-lg bg-pink-500 text-white text-sm hover:bg-pink-600 transition"
                    >
                        Seviyeme uygun quizlere git 🚀
                    </button>
                </div>
            )}

            {/* Sorular alanı */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6">
                {questions.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Şu an için seviye belirleme sorusu bulunamadı.
                    </p>
                ) : (
                    <>
                        <h2 className="text-lg font-semibold mb-4">
                            Sorular ({questions.length} adet)
                        </h2>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                            {questions.map((q, index) => (
                                <div
                                    key={q.id}
                                    className="border rounded-lg p-3 bg-gray-50"
                                >
                                    <p className="font-medium mb-2">
                                        {index + 1}. {q.question}
                                        {q.level && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                                Seviye: {q.level}
                                            </span>
                                        )}
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        {q.options.map((opt) => (
                                            <label
                                                key={opt}
                                                className="flex items-center gap-2 text-sm cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    value={opt}
                                                    checked={answers[q.id] === opt}
                                                    onChange={() =>
                                                        handleOptionChange(q.id, opt)
                                                    }
                                                    className="accent-pink-500"
                                                />
                                                <span>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className={`mt-4 w-full py-2 rounded-lg text-white font-medium shadow ${submitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-purple-500 hover:bg-purple-600 transition"
                                }`}
                        >
                            {submitting ? "Gönderiliyor..." : "Testi Tamamla"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PlacementTestPage;
