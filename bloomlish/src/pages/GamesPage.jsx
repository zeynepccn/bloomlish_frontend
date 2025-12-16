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

    // "games" | "ranking" | "tasks" | "profile"
    const [activeTab, setActiveTab] = useState("games");

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

    const TabButton = ({ id, label }) => {
        const isActive = activeTab === id;
        return (
            <button
                onClick={() => setActiveTab(id)}
                className={[
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    isActive
                        ? "bg-gradient-to-r from-pink-300 to-pink-400 text-white border-transparent shadow-lg shadow-pink-200/60"
                        : "bg-white/70 backdrop-blur border-pink-200/60 text-pink-600 hover:bg-white hover:shadow-sm",
                ].join(" ")}
            >
                {label}
            </button>
        );
    };

    const progressPercent = Math.round(
        (weeklyGoal.done / weeklyGoal.total) * 100
    );

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-6xl flex flex-col gap-8">
                {/* HERO / HEADER */}
                <section className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Left side: title + description + tabs */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* headline */}
                        <div>
                            <h1 className="text-3xl font-extrabold leading-tight bg-gradient-to-r from-pink-600 via-rose-500 to-pink-700 bg-clip-text text-transparent">
                                Eğlenerek Öğren
                            </h1>
                            <p className="text-base text-pink-700 max-w-md mt-2">
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
                            className="!rounded-2xl border border-pink-200/70 bg-white/80 backdrop-blur shadow-[0_24px_48px_-12px_rgba(249,168,212,0.5)]"
                            bodyStyle={{ padding: "16px 20px 20px 20px" }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-pink-700 bg-pink-100 px-2 py-1 rounded-lg w-fit border border-pink-200/80">
                                        Haftalık Görev
                                    </span>
                                    <div className="text-sm font-medium text-pink-900 mt-2 leading-snug">
                                        {weeklyGoal.title}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-[10px] text-pink-400">
                                        Ödül
                                    </div>
                                    <div className="text-sm font-bold text-pink-700">
                                        +{weeklyGoal.rewardXP} XP
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-pink-600">
                                <span>
                                    İlerleme:{" "}
                                    <strong className="text-pink-800">
                                        {weeklyGoal.done}/{weeklyGoal.total}
                                    </strong>
                                </span>
                                <span className="text-pink-500">
                                    {progressPercent}%
                                </span>
                            </div>

                            <Progress
                                percent={progressPercent}
                                showInfo={false}
                                strokeColor={{
                                    from: "#f9a8d4",
                                    to: "#fbcfe8",
                                }}
                                trailColor="rgba(253,242,248,0.9)"
                                className="mt-1"
                            />

                            <AntButton
                                type="primary"
                                className="w-full !mt-4 !h-10 !rounded-xl !font-semibold !text-white !bg-gradient-to-r !from-pink-300 !to-pink-400 !border-none shadow-lg shadow-pink-200/60 hover:!scale-[1.02] hover:!shadow-pink-300/70 transition-transform"
                            >
                                Görevini Tamamla
                            </AntButton>
                        </Card>
                    </div>
                </section>

                {/* MAIN CONTENT AREA */}
                {activeTab === "games" && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
                        <GameCard
                            icon={<BookFilled className="text-xl text-white" />}
                            badgeText="Günlük Kelime"
                            title="Bugünün Kelimeleri"
                            desc="Her gün yeni bir kelimeyle mini quiz!"
                            xp="+2 XP"
                            cta="BAŞLA"
                            onClick={() => navigate("/games/daily-word")}
                        />

                        <GameCard
                            icon={<ThunderboltFilled className="text-xl text-white" />}
                            badgeText="Hızlı!"
                            title="Hızlı Eşleştirme"
                            desc="Kelimeleri anlamlarıyla saniyeler içinde eşleştir!"
                            xp="+3 XP"
                            cta="OYNA"
                            onClick={() => navigate("/game/match")}
                        />

                        <GameCard
                            icon={<SoundFilled className="text-xl text-white" />}
                            badgeText="Dinleme"
                            title="Dinleme Mini Oyunu"
                            desc="Duyduğunu doğru kelimeyle eşleştir!"
                            xp="+4 XP"
                            cta="DİNLE ve CEVAPLA"
                            onClick={() => navigate("/game/listen")}
                        />

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
                        <div className="text-xl font-semibold text-pink-800">
                            Günlük Görevler
                        </div>
                        <p className="text-pink-600 text-sm max-w-md mt-2 leading-relaxed">
                            Her gün belirli görevleri tamamla. XP kazan,
                            serini bozma ve bonus ödüller aç.
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
                        <div className="text-xl font-semibold text-pink-800">
                            Profilim
                        </div>
                        <p className="text-pink-600 text-sm max-w-md mt-2 leading-relaxed">
                            Seviye, toplam XP, istatistikler yakında burada
                            gözükecek 💖
                        </p>

                        <div className="mt-6 w-full max-w-sm">
                            <Card className="!rounded-2xl border border-pink-200/70 bg-white/80 backdrop-blur shadow-[0_24px_48px_-12px_rgba(249,168,212,0.5)]">
                                <div className="flex flex-col gap-3 items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-pink-200/60">
                                        Z
                                    </div>
                                    <div className="text-pink-800 font-semibold text-lg">
                                        Zeynep
                                    </div>
                                    <div className="text-pink-500 text-sm">
                                        Level 4 · 540 XP
                                    </div>
                                    <AntButton
                                        className="!mt-2 !rounded-xl !border-pink-200/70 !text-pink-700 !bg-white/70 backdrop-blur hover:!bg-white hover:!shadow-sm"
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
                        <Card className="w-full max-w-2xl !rounded-3xl border border-pink-200/60 bg-white/80 backdrop-blur shadow-[0_30px_60px_-15px_rgba(249,168,212,0.55)]">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <TrophyOutlined className="text-xl text-yellow-400 drop-shadow" />
                                        <div className="text-xl font-extrabold text-pink-800">
                                            Liderlik Tablosu
                                        </div>
                                    </div>
                                    <div className="text-pink-500 text-xs mt-1">
                                        En aktif oyuncular bu hafta 👇
                                    </div>
                                </div>

                                <Tag
                                    className="!rounded-lg !border-none !text-[10px] !px-2 !py-1 !font-semibold !bg-gradient-to-r !from-pink-300 !to-pink-400 !text-white shadow-lg shadow-pink-200/60"
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
        <Card className="!rounded-2xl border border-pink-200/70 bg-white/80 backdrop-blur shadow-[0_20px_40px_-10px_rgba(249,168,212,0.55)] hover:shadow-[0_28px_60px_-12px_rgba(249,168,212,0.7)] transition-shadow hover:scale-[1.02]">
            <div className="flex flex-col gap-4">
                {/* icon + badge */}
                <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center shadow-lg shadow-pink-200/60">
                        {icon}
                    </div>

                    <span className="text-[10px] font-semibold text-pink-700 bg-pink-100 px-2 py-1 rounded-lg border border-pink-200/80">
                        {badgeText}
                    </span>
                </div>

                {/* title/desc */}
                <div>
                    <div className="text-pink-900 font-semibold text-lg leading-tight">
                        {title}
                    </div>
                    <div className="text-pink-600 text-sm leading-snug mt-1">
                        {desc}
                    </div>
                </div>

                {/* xp + button */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onClick}
                        className="w-full h-10 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-pink-300 to-pink-400 shadow-lg shadow-pink-200/60 hover:scale-[1.02] hover:shadow-pink-300/70 transition-transform"
                    >
                        {cta}
                    </button>

                    <div className="text-[11px] text-pink-500 text-center font-medium">
                        {xp} / tur
                    </div>
                </div>
            </div>
        </Card>
    );
}

function TaskCard({ title, detail, completed }) {
    return (
        <Card className="!rounded-2xl border border-pink-200/70 bg-white/80 backdrop-blur shadow-[0_20px_40px_-10px_rgba(249,168,212,0.55)]">
            <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                    <div className="text-pink-900 font-semibold text-base leading-tight">
                        {title}
                    </div>
                    {completed ? (
                        <span className="text-[10px] font-semibold text-white bg-gradient-to-r from-pink-300 to-pink-400 px-2 py-1 rounded-lg shadow-pink-200/60 shadow-lg">
                            Tamamlandı
                        </span>
                    ) : (
                        <span className="text-[10px] font-semibold text-pink-700 bg-pink-100 px-2 py-1 rounded-lg border border-pink-200/80">
                            Aktif
                        </span>
                    )}
                </div>

                <div className="text-pink-600 text-sm">{detail}</div>

                {!completed && (
                    <button className="self-start text-xs font-semibold rounded-lg border border-pink-200/80 text-pink-700 bg-white/70 backdrop-blur px-3 py-1 hover:bg-white hover:shadow-sm transition">
                        Yap
                    </button>
                )}
            </div>
        </Card>
    );
}

function LeaderboardRow({ rank, name, xp }) {
    let badgeClass =
        "bg-pink-100 text-pink-700 border border-pink-200/80";
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
        <div className="flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur px-4 py-3 border border-pink-100/80">
            <div className="flex items-center gap-3">
                <div
                    className={
                        "w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl shadow " +
                        badgeClass
                    }
                >
                    {rank}
                </div>
                <div className="text-pink-900 font-semibold text-sm leading-tight">
                    {name}
                </div>
            </div>

            <div className="text-xs font-semibold rounded-lg border border-pink-300/70 text-pink-700 bg-pink-50 px-3 py-1 shadow-pink-100/60 shadow-inner">
                {xp} XP
            </div>
        </div>
    );
}
