import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function QuizQuestionsPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState(null);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [listeningData, setListeningData] = useState(null);

    const isListening = state?.testType === "dinleme";

    useEffect(() => {
        if (!state) {
            navigate("/quiz");
            return;
        }

        if (isListening && state.listeningData) {
            // backend'den gelen: { difficulty, audioGroups: [ { audioUrl, questions: [...] } ] }
            setListeningData(state.listeningData);

            const flatQuestions = state.listeningData.audioGroups.flatMap(
                (group) => group.questions
            );

            setQuestions(flatQuestions);

            const initialAnswers = flatQuestions.map((q) => ({
                questionId: q.id,
                selectedOption: null,
            }));
            setAnswers(initialAnswers);
        } else if (state.questions) {
            // normal quizler (kelime, dilbilgisi, okuma, yazım vs.)
            // Aynı mp3'e ait sorular peş peşe gelsin diye audioUrl + id'ye göre sıralıyoruz
            const sorted = [...state.questions].sort((a, b) => {
                const auA = a.audioUrl || "";
                const auB = b.audioUrl || "";
                if (auA === auB) {
                    return (a.id || 0) - (b.id || 0);
                }
                return auA.localeCompare(auB);
            });

            setQuestions(sorted);

            const initialAnswers = sorted.map((q) => ({
                questionId: q.id,
                selectedOption: null,
            }));
            setAnswers(initialAnswers);
        } else {
            navigate("/quiz");
        }
    }, [state, navigate, isListening]);

    const getListeningTopicFromAudioUrl = (audioUrl) => {
        if (!audioUrl) return "Listening";

        const fileName = audioUrl.split("/").pop(); // lesson35_conversation.mp3

    };

    const handleAnswerSelect = (questionId, optionText) => {
        if (results) return;

        setAnswers((prev) => {
            const existing = prev.find((a) => a.questionId === questionId);
            if (existing) {
                return prev.map((a) =>
                    a.questionId === questionId
                        ? { ...a, selectedOption: optionText }
                        : a
                );
            }
            return [...prev, { questionId, selectedOption: optionText }];
        });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                "http://localhost:8080/api/quiz/submit",
                { answers },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const resultData = res.data;
            setResults(resultData);
            setShowResultsModal(true);
        } catch (err) {
            console.error(err);
            alert("Quiz gönderilemedi. Sunucu hatası veya ağ problemi olabilir.");
        }
    };

    const getSelectedOption = (questionId) => {
        return answers.find((a) => a.questionId === questionId)?.selectedOption;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Quiz</h1>
                    <button
                        onClick={() => navigate("/quiz")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Ayarlara Geri Dön
                    </button>
                </div>

                {/* 🔊 DINLEME QUIZİ İSE GRUPLU GÖSTER */}
                {isListening && listeningData ? (
                    // audioGroups zaten backend'de audioUrl'e göre gruplanmış durumda
                    listeningData.audioGroups.map((group, groupIndex) => (

                        <div
                            key={group.audioId ?? groupIndex}
                            className="mb-8 border-b pb-4"
                        >
                            <div className="mb-3">
                                <p className="text-lg font-bold text-purple-700 mb-1">
                                    🎧{group.topic || "Listening Activity"}
                                </p>
                                <p className="text-sm text-gray-600 -mt-1 mb-2">
                                    Listening {groupIndex + 1}
                                </p>

                                <audio
                                    controls
                                    src={`http://localhost:8080${group.audioUrl}`}
                                    className="w-full my-3"
                                />
                            </div>

                            {group.questions.map((q, index) => {
                                const selectedOption = getSelectedOption(q.id);

                                return (
                                    <div key={q.id} className="mb-4">
                                        <p className="mb-2 font-medium">
                                            {index + 1}. {q.question}
                                        </p>

                                        <div className="flex flex-col gap-2">
                                            {q.options?.map((optText, i) => {
                                                const isCorrectOption =
                                                    results && q.answer === optText;
                                                const isUserSelected =
                                                    selectedOption === optText;

                                                let extraClasses = "";
                                                if (results) {
                                                    if (isCorrectOption) {
                                                        extraClasses =
                                                            "bg-green-200 border-green-600";
                                                    } else if (
                                                        isUserSelected &&
                                                        !isCorrectOption
                                                    ) {
                                                        extraClasses =
                                                            "bg-red-200 border-red-600";
                                                    }
                                                }

                                                return (
                                                    <label
                                                        key={i}
                                                        className={`flex items-center gap-2 border p-2 rounded ${extraClasses}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${q.id}`}
                                                            value={optText}
                                                            disabled={!!results}
                                                            checked={isUserSelected}
                                                            onChange={() =>
                                                                handleAnswerSelect(
                                                                    q.id,
                                                                    optText
                                                                )
                                                            }
                                                        />
                                                        {optText}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    // 🔤 NORMAL QUIZLER (kelime, dil, okuma, yazım vs.)
                    questions.map((q, index) => {
                        const selectedOption = getSelectedOption(q.id);

                        const audioUrl = q.audioUrl
                            ? `http://localhost:8080${q.audioUrl}`
                            : null;

                        // Normal tipte bir soruda da audio varsa (ileride kullanırsan)
                        // aynı mantıkla render edilecek
                        const prevAudioUrl =
                            index > 0 ? questions[index - 1].audioUrl : null;
                        const isFirstOfGroup =
                            q.audioUrl && q.audioUrl !== prevAudioUrl;

                        return (
                            <div key={q.id} className="mb-6 border-b pb-4">
                                {isFirstOfGroup && audioUrl && (
                                    <div className="mb-3">
                                        <p className="text-sm font-semibold text-blue-700 mb-1">
                                            {getListeningTopicFromAudioUrl(q.audioUrl)}
                                        </p>
                                        <audio
                                            controls
                                            src={audioUrl}
                                            className="w-full my-3"
                                        />
                                    </div>
                                )}

                                <p className="mb-2 font-medium">
                                    {index + 1}. {q.question}
                                </p>

                                <div className="flex flex-col gap-2">
                                    {q.options?.map((optText, i) => {
                                        const isCorrectOption =
                                            results && q.answer === optText;
                                        const isUserSelected =
                                            selectedOption === optText;

                                        let extraClasses = "";
                                        if (results) {
                                            if (isCorrectOption) {
                                                extraClasses =
                                                    "bg-green-200 border-green-600";
                                            } else if (
                                                isUserSelected && !isCorrectOption
                                            ) {
                                                extraClasses =
                                                    "bg-red-200 border-red-600";
                                            }
                                        }

                                        return (
                                            <label
                                                key={i}
                                                className={`flex items-center gap-2 border p-2 rounded ${extraClasses}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${q.id}`}
                                                    value={optText}
                                                    disabled={!!results}
                                                    checked={isUserSelected}
                                                    onChange={() =>
                                                        handleAnswerSelect(
                                                            q.id,
                                                            optText
                                                        )
                                                    }
                                                />
                                                {optText}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition shadow"
                    disabled={!!results}
                >
                    Cevapları Gönder
                </button>
            </div>

            {showResultsModal && results && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
                        <h2 className="text-xl font-bold mb-2">Sonuçların 🎉</h2>

                        <p className="text-4xl font-extrabold text-pink-500 mb-2">
                            {results.score}{" "}
                            <span className="text-lg font-medium">Puan</span>
                        </p>
                        <p className="mb-2">
                            Seviyen:{" "}
                            <span className="font-semibold">{results.level}</span>
                        </p>

                        <div className="flex justify-around mb-3">
                            <div>
                                <p className="text-green-600 font-semibold">Doğru</p>
                                <p className="text-lg">{results.correctCount}</p>
                            </div>
                            <div>
                                <p className="text-red-600 font-semibold">Yanlış</p>
                                <p className="text-lg">{results.wrongCount}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowResultsModal(false)}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizQuestionsPage;