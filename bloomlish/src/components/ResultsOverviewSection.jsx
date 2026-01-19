import React, { useEffect, useState } from "react";
import api from "../api";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

function ResultsOverviewSection() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get(
                    "/api/results/summary/me",
                );
                setSummary(res.data);
            } catch (err) {
                console.error("Sonuç özeti alınamadı:", err);
                setError("Sonuçların yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 text-center">
                Yükleniyor...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 text-center text-red-600">
                {error}
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6 text-center">
                Sonuç verisi bulunamadı.
            </div>
        );
    }

    const { averageScore, averageLevel, lastResult, dailyStats } = summary;


    const lastResultDate = lastResult?.takenAt
        ? lastResult.takenAt.substring(0, 10)
        : "-";
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    console.log("summary", summary);
    console.log("dailyStats raw", dailyStats);
    console.log(
        "mapped dates",
        (dailyStats || []).map((x) => [
            x.date,
            new Date(x.date),
            new Date(x.date + "T00:00:00"),
        ])
    );
    console.log("sevenDaysAgo / today", sevenDaysAgo, today);

    const last7DaysStats = (dailyStats || [])
        .filter((day) => {
            // day.date formatı "2025-12-01" gibi ise bu yeterli
            const d = new Date(day.date + "T00:00:00");

            return d >= sevenDaysAgo && d <= today;
        })
        .sort((a, b) => new Date(a.date + "T00:00:00") - new Date(b.date + "T00:00:00"));

    // Grafik için data
    const chartData = last7DaysStats.map((day) => ({
        date: day.date,
        correct: day.correct,
        wrong: day.wrong,
    }));

    const hasAnyStats = dailyStats && dailyStats.length > 0;
    const hasLast7Stats = last7DaysStats.length > 0;

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* SONUÇLARIM KARTI */}
                <div className="p-6 bg-white rounded-2xl shadow-lg border text-center">
                    <h2 className="font-semibold mb-3 text-lg">Sonuçlarım</h2>

                    <p className="text-4xl font-extrabold text-pink-500">
                        {averageScore}
                        <span className="text-lg font-semibold ml-1">puan</span>
                    </p>

                    <p className="mt-1">
                        Seviyen:{" "}
                        <span className="font-medium">
                            {averageLevel || "Bilinmiyor"}
                        </span>
                    </p>

                    {lastResult ? (
                        <p className="text-sm text-gray-500">
                            Son test tarihi: {lastResultDate}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Henüz test sonucu yok.
                        </p>
                    )}
                </div>

                {/* TEST İSTATİSTİKLERİ */}
                <div className="p-6 bg-white rounded-2xl shadow-lg border">
                    <h2 className="font-semibold mb-1 text-lg text-center">
                        Test İstatistikleri
                    </h2>
                    <p className="text-xs text-center text-gray-400 mb-3">
                        Son 7 güne ait doğru / yanlış sayıları
                    </p>

                    {/* Günlük doğru / yanlış listesi (son 7 gün) */}
                    <div className="max-h-40 overflow-y-auto text-sm mb-4 border rounded">
                        {!hasAnyStats ? (
                            <p className="text-gray-400 text-center py-2">
                                Henüz istatistik yok. Test çözmeye başla!
                            </p>
                        ) : !hasLast7Stats ? (
                            <p className="text-gray-400 text-center py-2">
                                Son 7 günde test çözmemişsin. Yeni bir quiz dene!
                            </p>
                        ) : (
                            last7DaysStats.map((day) => (
                                <div
                                    key={day.date}
                                    className="flex justify-between px-3 py-1 border-b last:border-b-0"
                                >
                                    <span className="font-medium">
                                        {day.date}
                                    </span>
                                    <span>
                                        {day.correct} &nbsp;/&nbsp;  {day.wrong}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* GRAFİK ALANI (son 7 gün) */}
                    {hasLast7Stats ? (
                        <div className="mt-2 h-40 border rounded bg-gray-50 px-2 py-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="correct"
                                        name="Doğru"
                                        stroke="#16a34a" // green-600
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="wrong"
                                        name="Yanlış"
                                        stroke="#dc2626" // red-600
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="mt-2 h-24 flex items-center justify-center border rounded bg-gray-100 text-gray-400 text-xs">
                            Son 7 gün için grafikte gösterilecek veri yok
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


export default ResultsOverviewSection;