import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import api from "../api";

export default function DailyWordGamePage() {
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pendingSummary, setPendingSummary] = useState(null);

    const startGame = async (newRound = false) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await api.get(
                `/api/daily-word/start?newRound=${newRound}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setGame(res.data);
        } catch (e) {
            console.error(e);
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log("HEADERS:", err.response?.headers);
            alert("Oyun başlatılamadı");
        } finally {
            setLoading(false);
        }
    };

    const answerQuestion = async (wordId, selected) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const res = await api.post(
                "/api/daily-word/answer",
                { wordId, selected },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.type === "RESULT" && res.data.result?.completed) {
                const gainedXP =
                    res.data.gainedXp ??
                    res.data.correctCount ??
                    res.data.totalCorrect ??
                    0;

                message.success(`🎉 Bu tur +${gainedXP} XP kazandın!`);
            }
            if (
                res.data.type === "SUMMARY" &&
                res.data.lastResult
            ) {
                setPendingSummary(res.data);
                setGame({
                    type: "RESULT",
                    result: res.data.lastResult
                });
            } else {
                setGame(res.data);
            }

        } catch (e) {
            console.error(e);
            alert("Cevap gönderilemedi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        startGame(false);
    }, []);

    if (loading || !game) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-xl">
                {game.type === "QUESTION" && (
                    <QuestionView game={game} onAnswer={answerQuestion} />
                )}

                {game.type === "RESULT" && (
                    <ResultView
                        game={game}
                        onNext={() => {
                            if (game.result.completed) {
                                startGame(false);
                            } else {
                                startGame(true);
                            }
                        }}
                    />
                )}

                {game.type === "SUMMARY" && (
                    <SummaryView
                        game={game}
                        onNewRound={() => startGame(true)}
                    />
                )}
            </div>
        </div>
    );
}


function formatMeaning(text) {
    if (!text) return "";
    return text
        .split(" ")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

function QuestionView({ game, onAnswer }) {
    const { sentence, options, wordId, order } = game.question;

    return (
        <Card className="!rounded-3xl shadow-xl border-0 bg-gradient-to-br from-pink-50 to-white">
            <div className="flex justify-between items-center mb-4">
                <div className="text-xs font-semibold text-pink-500">
                    Soru {order} / 5
                </div>
                <div className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                    Günün Kelimesi
                </div>
            </div>

            <div className="text-2xl font-extrabold text-pink-800 mb-5 leading-snug">
                Boşluğu doğru kelimeyle tamamla
            </div>

            <div
                className="
                text-pink-700
                bg-white/80
                backdrop-blur
                p-5
                rounded-2xl
                mb-6
                text-lg
                shadow-inner
                border border-pink-100
            "
            >
                {sentence}
            </div>

            <div className="flex flex-col gap-3">
                {options.map((opt) => (
                    <Button
                        key={opt}
                        onClick={() => onAnswer(wordId, opt)}
                        className="
                        !rounded-2xl
                        !border
                        !border-pink-200
                        !text-pink-700
                        !py-3
                        !text-base
                        hover:!bg-pink-50
                        hover:!scale-[1.02]
                        transition-all
                    "
                    >
                        {opt}
                    </Button>
                ))}
            </div>
        </Card>
    );
}

function ResultView({ game, onNext }) {
    if (!game?.result) return null;
    const { correct, word, meaning } = game.result;

    return (
        <Card className="!rounded-3xl shadow-xl border-0 bg-gradient-to-br from-pink-50 to-white text-center">

            <div className="flex justify-center mb-5">
                <div
                    className={`
                    px-6 py-2 rounded-full text-sm font-semibold
                    ${correct
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-red-50 text-red-500 border border-red-200"
                        }
                `}
                >
                    {correct ? "Doğru Cevap" : "Yanlış Cevap"}
                </div>
            </div>

            <div className="text-pink-800 font-extrabold text-3xl mb-2">
                {correct ? (
                    word
                ) : (
                    <>Doğru Cevap: {word}</>
                )}
            </div>


            <div className="text-pink-600 text-base italic mb-6">
                {formatMeaning(meaning)}
            </div>


            <div className="w-12 h-1 bg-pink-200 rounded-full mx-auto mb-6" />

            <Button
                onClick={onNext}
                className="
                !w-full
                !rounded-2xl
                !bg-gradient-to-r
                !from-pink-400
                !to-pink-500
                !text-white
                !border-none
                !py-3
                !text-lg
                hover:!scale-[1.02]
                transition-all
            "
            >
                Devam Et
            </Button>
        </Card>
    );
}

function SummaryView({ game, onNewRound }) {

    const rounds = Array.isArray(game.rounds) ? game.rounds : [];

    const [page, setPage] = useState(0);
    const PAGE_SIZE = 2;

    const pagedRounds = rounds.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE
    );

    return (
        <Card className="!rounded-3xl shadow-xl border-0 bg-gradient-to-br from-pink-50 to-white">
            <div className="flex items-center justify-between mb-6">
                <Button
                    onClick={() => window.location.href = "/games"}
                    className="
                    !rounded-xl
                    !border
                    !border-pink-300
                    !text-pink-600
                    !px-4
                    !py-1
                    hover:!bg-pink-50
                    transition-all
                "
                >
                    ← Oyunlara Dön
                </Button>

                <div className="text-2xl font-extrabold text-pink-800">
                    Günün Turları
                </div>

                {rounds.length > 0 ? (
                    <div className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                        Toplam {rounds.length} Tur
                    </div>
                ) : (
                    <div className="w-20" />
                )}
            </div>

            <div className="flex flex-col gap-6">
                {pagedRounds.map((r) => (
                    <div
                        key={r.roundNumber}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-bold text-pink-700">
                                Tur {r.roundNumber}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            {(r.words || []).map((w, i) => (
                                <div
                                    key={i}
                                    className="
                                    flex
                                    justify-between
                                    items-center
                                    bg-pink-50
                                    px-4
                                    py-2
                                    rounded-xl
                                    hover:bg-pink-100
                                    transition
                                "
                                >
                                    <span className="font-medium text-pink-800">
                                        {w.word}
                                    </span>
                                    <span className="text-pink-600 text-sm italic">
                                        {formatMeaning(w.meaning)}
                                    </span>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {rounds.length > PAGE_SIZE && (
                <div className="flex justify-between items-center mt-6">
                    <Button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="!rounded-xl"
                    >
                        ◀ Önceki
                    </Button>

                    <div className="text-xs text-pink-400">
                        Sayfa {page + 1} / {Math.ceil(rounds.length / PAGE_SIZE)}
                    </div>

                    <Button
                        disabled={(page + 1) * PAGE_SIZE >= rounds.length}
                        onClick={() => setPage(p => p + 1)}
                        className="!rounded-xl"
                    >
                        Sonraki ▶
                    </Button>
                </div>
            )}

            <Button
                onClick={onNewRound}
                className="
                !mt-8
                !w-full
                !rounded-2xl
                !bg-gradient-to-r
                !from-pink-400
                !to-pink-500
                !text-white
                !border-none
                !py-3
                !text-lg
                hover:!scale-[1.03]
                transition-all
            "
            >
                Yeni Tur Oyna
            </Button>

        </Card>
    );


}
