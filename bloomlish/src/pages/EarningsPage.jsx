import React, { useState, useEffect } from "react";
import api from "../api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// 👇 Lucide ikonları
import { Users, Wallet, CalendarDays, BarChart3, Briefcase } from "lucide-react";

export default function EarningsPage() {
    const [filter, setFilter] = useState("");

    const [summary, setSummary] = useState(null);
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const months = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];


    const token = localStorage.getItem("token");

    useEffect(() => {
        // SUMMARY DATASI
        api.get("/api/instructor/earnings/summary", {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setSummary({
                totalSoldLessons: res.data.totalSoldLessons,
                totalRevenue: res.data.totalRevenue,
                thisMonthRevenue: res.data.thisMonthRevenue
            });
        });

        // MONTHLY DATASI
        api.get("/api/instructor/earnings/monthly", {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {

            const monthlyData = res.data.data;

            const formatted = months.map((monthName) => ({
                month: monthName,
                gelir: monthlyData[monthName] ? Number(monthlyData[monthName]) : 0
            }));

            setData(formatted);
        });


        // TABLE DATASI
        api.get("/api/instructor/earnings/table", {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            const formatted = res.data.data.map((row) => ({
                date: new Date(row.date).toLocaleDateString("tr-TR"),
                lesson: row.lesson,
                student: row.student,
                price: row.price,
                status: row.status,
            }));
            setTableData(formatted);
        });
    }, []);

    if (!summary) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-pink-600">
                Yükleniyor...
            </div>
        );
    }

    const filteredData = tableData.filter((row) =>
        row.lesson.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 p-8 text-gray-800">
            <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">Kazançlarım</h1>

            {/* Özet Kartlar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <SummaryCard
                    title="Toplam Ders Sayısı"
                    value={summary.totalSoldLessons}
                    icon={<Users className="w-8 h-8 text-pink-500 mx-auto" />}
                />

                <SummaryCard
                    title="Toplam Kazanç"
                    value={`₺${summary.totalRevenue}`}
                    icon={<Wallet className="w-8 h-8 text-pink-500 mx-auto" />}
                />
                <SummaryCard
                    title="Bu Ay"
                    value={`₺${summary.thisMonthRevenue}`}
                    icon={<CalendarDays className="w-8 h-8 text-pink-500 mx-auto" />}
                />
            </div>

            {/* Grafik */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="text-pink-500 w-5 h-5" />
                    <h2 className="text-xl font-semibold text-pink-600">Aylık Gelir Grafiği</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="gelir" fill="#f472b6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Filtreleme */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="text-pink-500 w-5 h-5" />
                    <h2 className="text-xl font-semibold text-pink-600">Gelir Tablosu</h2>
                </div>
                <input
                    type="text"
                    placeholder="Ders adına göre ara..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-pink-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-md">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-pink-100 text-pink-700">
                        <tr>
                            <th className="px-4 py-3">Tarih</th>
                            <th className="px-4 py-3">Ders Adı</th>
                            <th className="px-4 py-3">Öğrenci</th>
                            <th className="px-4 py-3">Ücret</th>
                            <th className="px-4 py-3">Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr
                                key={index}
                                className="border-t hover:bg-pink-50 transition-colors"
                            >
                                <td className="px-4 py-2">{row.date}</td>
                                <td className="px-4 py-2">{row.lesson}</td>
                                <td className="px-4 py-2">{row.student}</td>
                                <td className="px-4 py-2">₺{row.price}</td>
                                <td
                                    className={`px-4 py-2 font-medium ${row.status === "Ödendi"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {row.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function SummaryCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-all">
            <div className="mb-2 flex justify-center">{icon}</div>
            <h3 className="text-lg font-semibold text-pink-600">{title}</h3>
            <p className="text-2xl font-bold text-gray-700">{value}</p>
        </div>
    );
}
