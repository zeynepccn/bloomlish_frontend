import React, { useState, useEffect } from "react";
import { Card, Progress, Button as AntButton, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
    TrophyOutlined,
    ThunderboltFilled,
    SoundFilled,
    ClockCircleFilled,
    BookFilled,
} from "@ant-design/icons";

import api from "../api";


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
    const [leaderboard, setLeaderboard] = useState([]);
    const [me, setMe] = useState(null);

    useEffect(() => {
        api
            .get("/api/users/me")
            .then((res) => {
                console.log("GamesPage ME →", res.data);
                setMe(res.data);
            })
            .catch((err) => console.error("Profil (me) alınamadı", err));
    }, []);



    useEffect(() => {
        if (activeTab !== "ranking") return;

        api.get("/api/leaderboard/weekly")
            .then((res) => {
                let data = res.data;

                console.log("LEADERBOARD RAW →", data);
                console.log("isArray?", Array.isArray(data), "type:", typeof data);

                if (typeof data === "string") {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        console.error("Leaderboard JSON parse edilemedi:", e);
                        data = [];
                    }
                }

                const safeArray =
                    Array.isArray(data) ? data :
                        Array.isArray(data?.content) ? data.content :
                            Array.isArray(data?.data) ? data.data :
                                Array.isArray(data?.items) ? data.items :
                                    [];

                setLeaderboard(safeArray);
            })
            .catch((err) => {
                console.error("Leaderboard alınamadı:", err);
                setLeaderboard([]);
            });
    }, [activeTab]);

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
                                ve liderlik tablosunda yüksel
                            </p>
                        </div>

                        {/* tabs */}
                        <div className="flex flex-wrap gap-2">
                            {/*<TabButton id="tasks" label="Günlük Görevler" />*/}
                            <TabButton id="games" label="Oyunlar" />
                            <TabButton id="profile" label="Profilim" />
                            <TabButton id="ranking" label="Sıralama" />
                        </div>
                    </div>

                    {/* Right side: weekly mission card */}

                </section>

                {/* MAIN CONTENT AREA */}
                {activeTab === "games" && (
                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">

                        {/* AKTİF OYUNLAR (ORTALI) */}
                        <div className="sm:col-span-2 xl:col-span-4 flex flex-col sm:flex-row justify-center gap-4 xl:gap-6">
                            <GameCard
                                icon={<BookFilled className="text-xl text-white" />}
                                badgeText="Günlük Kelimeler"
                                title="Bugünün Kelimeleri"
                                desc="Her gün yeni kelimeler ile mini quiz!"
                                xp="+5 XP"
                                cta="BAŞLA"
                                onClick={() => navigate("/games/daily-word")}
                            />

                            <GameCard
                                icon={<ThunderboltFilled className="text-xl text-white" />}
                                badgeText="Hızlı!"
                                title="Hızlı Eşleştirme"
                                desc="Kelimeleri anlamlarıyla saniyeler içinde eşleştir!"
                                xp="+5 XP"
                                cta="OYNA"
                                onClick={() => navigate("/game/match")}
                            />
                        </div>


                    </section>
                )}


                {activeTab === "profile" && (
                    <section className="flex flex-col items-center text-center py-10">
                        <div className="text-xl font-semibold text-pink-800">Profilim</div>


                        <div className="mt-6 w-full max-w-sm">
                            <Card className="!rounded-2xl border border-pink-200/70 bg-white/80 backdrop-blur shadow-[0_24px_48px_-12px_rgba(249,168,212,0.5)]">
                                <div className="flex flex-col gap-3 items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-400 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-pink-200/60">
                                        {(me?.name || me?.username || "U").charAt(0).toUpperCase()}
                                    </div>

                                    <div className="text-pink-800 font-semibold text-lg">
                                        {me?.name || me?.username || "—"}
                                    </div>

                                    <div className="text-pink-500 text-sm">
                                        {me?.totalXp || 0} XP
                                    </div>

                                    <AntButton
                                        className="!mt-2 !rounded-xl !border-pink-200/70 !text-pink-700 !bg-white/70 backdrop-blur hover:!bg-white hover:!shadow-sm"
                                        onClick={() => navigate("/profile")}
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

                                <Tag className="!rounded-lg !border-none !text-[10px] !px-2 !py-1 !font-semibold !bg-gradient-to-r !from-pink-300 !to-pink-400 !text-white shadow-lg shadow-pink-200/60">
                                    Haftalık
                                </Tag>
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                {console.log(
                                    "UI order weeklyXp:",
                                    (Array.isArray(leaderboard) ? leaderboard : []).map(u => u.weeklyXp)
                                )}

                                {Array.isArray(leaderboard) &&
                                    [...leaderboard]
                                        .sort((a, b) => Number(b?.weeklyXp ?? 0) - Number(a?.weeklyXp ?? 0))
                                        .map((user, idx) => (
                                            <LeaderboardRow
                                                key={user.userID ?? `${idx}`}
                                                rank={idx + 1}
                                                name={user.displayName || user.username}
                                                xp={Number(user.weeklyXp ?? 0)}
                                            />
                                        ))}


                                {(!Array.isArray(leaderboard) || leaderboard.length === 0) && (
                                    <div className="text-center text-gray-400 text-sm">
                                        Henüz sıralama yok
                                    </div>
                                )}
                            </div>
                        </Card>
                    </section>
                )}

            </div>
        </div>
    );
}



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
