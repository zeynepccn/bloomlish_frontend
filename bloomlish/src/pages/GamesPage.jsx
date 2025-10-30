import React, { useState } from "react";
import { Card, Progress, Button as AntButton, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
    TrophyOutlined,
    ThunderboltFilled,
    SoundFilled,
    ClockCircleFilled,
    BookFilled,
} from "@ant-design/icons";

export default function GamesPage() {
    const navigate = useNavigate();

    // aktif sekme state
    // "games" | "ranking" | "tasks" | "profile"
    const [activeTab, setActiveTab] = useState("games");

    // fake data (ileride backendden çekersin)
    const weeklyGoal = {
        title: "Bu hafta 5 oyun tamamla = +10 XP",
        done: 3,
        total: 5,
        rewardXP: 10,
    };

    const leaderboard = [
        { id: 1, name: "Deniz METİN", xp: 230 },
        { id: 2, name: "AAAA", xp: 200 },
        { id: 3, name: "ELA", xp: 187 },
        { id: 4, name: "Zeynep", xp: 160 },
        { id: 5, name: "AYT", xp: 150 },
    ];

    // küçük helper: sekme butonu componenti
    const TabButton = ({ id, label }) => {
        const isActive = activeTab === id;
        return (
            <button
                onClick={() => setActiveTab(id)}
                className={[
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    isActive
                        ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white border-transparent shadow-lg shadow-pink-400/40"
                        : "bg-white/60 backdrop-blur border-pink-300/50 text-violet-700 hover:bg-white hover:shadow",
                ].join(" ")}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-100 to-violet-100 flex justify-center px-4 py-10">
            <div className="w-full max-w-6xl flex flex-col gap-8">

                {/* HERO / HEADER */}
                <section className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Left side: title + description + tabs */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* gradient headline */}
                        <div>
                            <h1 className="text-3xl font-extrabold leading-tight bg-gradient-to-r from-pink-600 via-fuchsia-600 to-violet-700 bg-clip-text text-transparent">
                                Eğlenerek Öğren
                            </h1>
                            <p className="text-base text-purple-600 max-w-md mt-2">
                                Dil öğrenirken eğlen! Mini oyunları oyna, XP kazan,
                                haftalık görevleri tamamla ve liderlik tablosunda yüksel 🏆
                            </p>
                        </div>

                        {/* tabs */}
                        <div className="flex flex-wrap gap-2">
                            <TabButton id="tasks" label="Günlük Görevler" />
                            <TabButton id="games" label="Oyunlar" />
                            <TabButton id="profile" label="Profilim" />
                            <TabButton id="ranking" label="Sıralama" />
                        </div>
                    </div>

                    {/* Right side: weekly mission card */}
                    <div className="w-full md:w-[320px]">
                        <Card
                            className="!rounded-2xl border border-pink-300/50 bg-white/70 backdrop-blur shadow-[0_24px_48px_-12px_rgba(236,72,153,0.4)]"
                            bodyStyle={{ padding: "16px 20px 20px 20px" }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg w-fit border border-pink-300/60">
                                        Haftalık Görev
                                    </span>
                                    <div className="text-sm font-medium text-violet-800 mt-2 leading-snug">
                                        {weeklyGoal.title}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-[10px] text-purple-500">
                                        Ödül
                                    </div>
                                    <div className="text-sm font-bold text-violet-700">
                                        +{weeklyGoal.rewardXP} XP
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-purple-600">
                                <span>
                                    İlerleme:{" "}
                                    <strong className="text-violet-700">
                                        {weeklyGoal.done}/{weeklyGoal.total}
                                    </strong>
                                </span>
                                <span className="text-purple-500">
                                    {Math.round(
                                        (weeklyGoal.done / weeklyGoal.total) * 100
                                    )}
                                    %
                                </span>
                            </div>

                            <Progress
                                percent={Math.round(
                                    (weeklyGoal.done / weeklyGoal.total) * 100
                                )}
                                showInfo={false}
                                strokeColor={{
                                    from: "#ec4899",
                                    to: "#8b5cf6",
                                }}
                                trailColor="rgba(203,213,225,0.4)" // slate-300/40
                                className="mt-1"
                            />

                            <AntButton
                                type="primary"
                                className="w-full !mt-4 !h-10 !rounded-xl !font-semibold !text-white !bg-gradient-to-r !from-pink-500 !to-violet-500 !border-none shadow-lg shadow-pink-400/40 hover:!scale-[1.02] hover:!shadow-pink-500/50 transition-transform"
                            >
                                Görevini Tamamla
                            </AntButton>
                        </Card>
                    </div>
                </section>

                {/* MAIN CONTENT AREA */}
                {activeTab === "games" && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
                        {/* Game Card 1 */}
                        <GameCard
                            icon={<BookFilled className="text-xl text-white" />}
                            badgeText="Günlük Kelime"
                            title="Bugünün Kelimesi"
                            desc="Her gün yeni bir kelimeyle mini quiz!"
                            xp="+2 XP"
                            cta="BAŞLA"
                            onClick={() => navigate("/game/word-of-the-day")}
                        />

                        {/* Game Card 2 */}
                        <GameCard
                            icon={<ThunderboltFilled className="text-xl text-white" />}
                            badgeText="Hızlı!"
                            title="Hızlı Eşleştirme"
                            desc="Kelimeleri anlamlarıyla saniyeler içinde eşleştir!"
                            xp="+3 XP"
                            cta="OYNA"
                            onClick={() => navigate("/game/match")}
                        />

                        {/* Game Card 3 */}
                        <GameCard
                            icon={<SoundFilled className="text-xl text-white" />}
                            badgeText="Dinleme"
                            title="Dinleme Mini Oyunu"
                            desc="Duyduğunu doğru kelimeyle eşleştir!"
                            xp="+4 XP"
                            cta="DİNLE ve CEVAPLA"
                            onClick={() => navigate("/game/listen")}
                        />

                        {/* Game Card 4 */}
                        <GameCard
                            icon={<ClockCircleFilled className="text-xl text-white" />}
                            badgeText="Refleks"
                            title="Hızlı Tepki Testi"
                            desc="Görseli veya sesi en hızlı şekilde eşleştir!"
                            xp="+5 XP"
                            cta="BAŞLA"
                            onClick={() => navigate("/game/reaction")}
                        />
                    </section>
                )}

                {activeTab === "tasks" && (
                    <section className="flex flex-col items-center text-center py-10">
                        <div className="text-xl font-semibold text-violet-800">
                            Günlük Görevler
                        </div>
                        <p className="text-purple-600 text-sm max-w-md mt-2 leading-relaxed">
                            Her gün belirli görevleri tamamla. XP kazan, serini
                            bozma ve bonus ödüller aç.
                        </p>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                            <TaskCard
                                title="3 oyun oyna"
                                detail="+4 XP"
                                completed={false}
                            />
                            <TaskCard
                                title="Bugünün kelimesini çöz"
                                detail="+2 XP"
                                completed={true}
                            />
                        </div>
                    </section>
                )}

                {activeTab === "profile" && (
                    <section className="flex flex-col items-center text-center py-10">
                        <div className="text-xl font-semibold text-violet-800">
                            Profilim
                        </div>
                        <p className="text-purple-600 text-sm max-w-md mt-2 leading-relaxed">
                            Seviye, toplam XP, istatistikler yakında burada
                            gözükecek 💖
                        </p>

                        <div className="mt-6 w-full max-w-sm">
                            <Card className="!rounded-2xl border border-violet-300/50 bg-white/70 backdrop-blur shadow-[0_24px_48px_-12px_rgba(139,92,246,0.4)]">
                                <div className="flex flex-col gap-3 items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-pink-400/40">
                                        Z
                                    </div>
                                    <div className="text-violet-800 font-semibold text-lg">
                                        Zeynep
                                    </div>
                                    <div className="text-purple-500 text-sm">
                                        Level 4 · 540 XP
                                    </div>
                                    <AntButton
                                        className="!mt-2 !rounded-xl !border-violet-400/50 !text-violet-700 !bg-white/60 backdrop-blur hover:!bg-white hover:!shadow"
                                    >
                                        Profili Gör
                                    </AntButton>
                                </div>
                            </Card>
                        </div>
                    </section>
                )}

                {activeTab === "ranking" && (
                    <section className="flex flex-col items-center py-10">
                        <Card className="w-full max-w-2xl !rounded-3xl border border-violet-300/40 bg-white/60 backdrop-blur shadow-[0_30px_60px_-15px_rgba(168,85,247,0.45)]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <TrophyOutlined className="text-xl text-yellow-400 drop-shadow" />
                                        <div className="text-xl font-extrabold text-violet-800">
                                            Liderlik Tablosu
                                        </div>
                                    </div>
                                    <div className="text-purple-500 text-xs mt-1">
                                        En aktif oyuncular bu hafta 👇
                                    </div>
                                </div>

                                <Tag
                                    className="!rounded-lg !border-none !text-[10px] !px-2 !py-1 !font-semibold !bg-gradient-to-r !from-pink-500 !to-violet-500 !text-white shadow-lg shadow-pink-400/40"
                                >
                                    Haftalık
                                </Tag>
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                {leaderboard.map((user, idx) => (
                                    <LeaderboardRow
                                        key={user.id}
                                        rank={idx + 1}
                                        name={user.name}
                                        xp={user.xp}
                                    />
                                ))}
                            </div>
                        </Card>
                    </section>
                )}
            </div>
        </div>
    );
}

/* ------------------- Small components ------------------- */

function GameCard({ icon, badgeText, title, desc, xp, cta, onClick }) {
    return (
        <Card className="!rounded-2xl border border-pink-200/50 bg-white/70 backdrop-blur shadow-[0_20px_40px_-10px_rgba(232,121,249,0.4)] hover:shadow-[0_28px_60px_-12px_rgba(232,121,249,0.6)] transition-shadow hover:scale-[1.02]">
            <div className="flex flex-col gap-4">
                {/* icon + badge */}
                <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg shadow-pink-400/40">
                        {icon}
                    </div>

                    <span className="text-[10px] font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg border border-pink-300/60">
                        {badgeText}
                    </span>
                </div>

                {/* title/desc */}
                <div>
                    <div className="text-violet-800 font-semibold text-lg leading-tight">
                        {title}
                    </div>
                    <div className="text-purple-600 text-sm leading-snug mt-1">
                        {desc}
                    </div>
                </div>

                {/* xp + button */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onClick}
                        className="w-full h-10 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-pink-500 to-violet-500 shadow-lg shadow-pink-400/40 hover:scale-[1.02] hover:shadow-pink-500/50 transition-transform"
                    >
                        {cta}
                    </button>

                    <div className="text-[11px] text-purple-500 text-center font-medium">
                        {xp} / tur
                    </div>
                </div>
            </div>
        </Card>
    );
}

function TaskCard({ title, detail, completed }) {
    return (
        <Card className="!rounded-2xl border border-pink-200/50 bg-white/70 backdrop-blur shadow-[0_20px_40px_-10px_rgba(232,121,249,0.4)]">
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <div className="text-violet-800 font-semibold text-base leading-tight">
                        {title}
                    </div>
                    {completed ? (
                        <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 px-2 py-1 rounded-lg shadow-pink-400/40 shadow-lg">
                            Tamamlandı
                        </span>
                    ) : (
                        <span className="text-[10px] font-semibold text-pink-600 bg-pink-100 px-2 py-1 rounded-lg border border-pink-300/60">
                            Aktif
                        </span>
                    )}
                </div>

                <div className="text-purple-600 text-sm">{detail}</div>

                {!completed && (
                    <button className="self-start text-xs font-semibold rounded-lg border border-violet-400/50 text-violet-700 bg-white/60 backdrop-blur px-3 py-1 hover:bg-white hover:shadow transition">
                        Yap
                    </button>
                )}
            </div>
        </Card>
    );
}

function LeaderboardRow({ rank, name, xp }) {

    let badgeClass =
        "bg-purple-100 text-purple-700 border border-purple-300/60";
    if (rank === 1)
        badgeClass =
            "bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 border border-yellow-500/50";
    if (rank === 2)
        badgeClass =
            "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 border border-gray-400/60";
    if (rank === 3)
        badgeClass =
            "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900 border border-amber-600/60";

    return (
        <div className="flex items-center justify-between rounded-2xl bg-white/60 backdrop-blur px-4 py-3 border border-violet-200/60">
            <div className="flex items-center gap-3">
                <div
                    className={
                        "w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl shadow " +
                        badgeClass
                    }
                >
                    {rank}
                </div>
                <div className="text-violet-800 font-semibold text-sm leading-tight">
                    {name}
                </div>
            </div>

            <div className="text-xs font-semibold rounded-lg border border-pink-300/60 text-pink-600 bg-pink-50 px-3 py-1 shadow-pink-200/50 shadow-inner">
                {xp} XP
            </div>
        </div>
    );
}
