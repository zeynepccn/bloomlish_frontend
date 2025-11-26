import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function QuizQuestionsPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (!state || !state.questions) {
            // Direkt bu sayfaya gelinmişse geri gönder
            navigate("/quiz");
            return;
        }
        setQuestions(state.questions);

        const initialAnswers = state.questions.map((q) => ({
            questionId: q.id,
            selectedOption: null,
        }));
        setAnswers(initialAnswers);
    }, [state, navigate]);

    // ⬇⬇⬇ BUNLARIN HEPSİ FONKSİYONUN İÇİNDE OLMALI ⬇⬇⬇
    const handleAnswerSelect = (questionId, optionText) => {
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
                {
                    answers, // [{ questionId, selectedOption }]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const results = res.data; // QuizResultsDto
            navigate("/quiz-results", { state: { results } });
        } catch (err) {
            console.error(err);
            alert("Quiz gönderilemedi. Sunucu hatası veya ağ problemi olabilir.");
        }
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

                {questions.map((q, index) => (
                    <div key={q.id} className="mb-6">
                        {/* 1., 2., 3. diye numaralandırma */}
                        <p className="mb-2 font-medium">
                            {index + 1}. {q.question}
                        </p>
                        <div className="flex flex-col gap-2">
                            {q.options?.map((optText, i) => (
                                <label
                                    key={i}
                                    className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
                                >
                                    <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={optText}
                                        checked={
                                            answers.find(
                                                (a) => a.questionId === q.id
                                            )?.selectedOption === optText
                                        }
                                        onChange={() =>
                                            handleAnswerSelect(q.id, optText)
                                        }
                                    />
                                    {optText}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleSubmit}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition shadow"
                >
                    Cevapları Gönder
                </button>
            </div>
        </div>
    );
}

export default QuizQuestionsPage;
