import React, { useEffect, useState } from "react";
import axios from "axios";

function ResultsOverviewSection() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "http://localhost:8080/api/results/summary/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
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

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            {/* Sonuçlarım + Test İstatistikleri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* SONUÇLARIM KARTI */}
                <div className="p-6 bg-white rounded-2xl shadow-lg border text-center">
                    <h2 className="font-semibold mb-3 text-lg">Sonuçlarım</h2>

                    {/* Ortalama puan */}
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
                    <h2 className="font-semibold mb-3 text-lg text-center">
                        Test İstatistikleri
                    </h2>

                    {/* Günlük doğru / yanlış listesi */}
                    <div className="max-h-40 overflow-y-auto text-sm mb-4 border rounded">
                        {!dailyStats || dailyStats.length === 0 ? (
                            <p className="text-gray-400 text-center py-2">
                                Henüz istatistik yok. Test çözmeye başla! 💪
                            </p>
                        ) : (
                            dailyStats.map((day) => (
                                <div
                                    key={day.date}
                                    className="flex justify-between px-3 py-1 border-b last:border-b-0"
                                >
                                    <span className="font-medium">
                                        {day.date}
                                    </span>
                                    <span>
                                        ✅ {day.correct} &nbsp;/&nbsp; ❌ {day.wrong}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* İleride grafik için alan */}
                    <div className="mt-2 h-24 flex items-center justify-center border rounded bg-gray-100 text-gray-400 text-xs">
                        [ Buraya ileride doğru/yanlış grafik gelecek 📊 ]
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsOverviewSection;