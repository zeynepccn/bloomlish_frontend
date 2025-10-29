import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../App.css";
import { useNavigate } from "react-router-dom";


   

 function InstructorPage() {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
     const [showModal, setShowModal] = useState(false);
     const navigate = useNavigate();

    const lessons = {
        "2025-10-29": [
            { student: "Zeynep", start: "14:00", end: "15:00", earning: 200 },
            { student: "Ali", start: "16:00", end: "17:30", earning: 150 },
        ],
        "2025-10-30": [{ student: "Mehmet", start: "10:00", end: "11:00", earning: 180 }],
        "2025-11-12": [{ student: "Deniz", start: "13:00", end: "14:30", earning: 250 }],
    };

    const feedbacks = [
        "Great lesson, thank you!",
        "I liked the interactive activities.",
        "This class was very helpful.",
    ];

    const data = [
        { name: "Öğrenci Sayısı", value: 45 },
        { name: "Ders Gelirleri", value: 70 },
    ];

    const handleDateClick = (value) => {
        const formatted = value.toLocaleDateString("en-CA");
        setSelectedDate(formatted);
        setShowModal(true);
    };

    const tileClassName = ({ date }) => {
        const formatted = date.toLocaleDateString("en-CA");
        return lessons[formatted] ? "lesson-day" : "";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center p-10 space-y-10">
            <h1 className="text-4xl font-bold text-pink-700 drop-shadow-sm tracking-wide">
                🌸 Eğitmen Paneli
            </h1>

            {/* Üst Butonlar */}
            <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => navigate("/createlesson")} className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105">
                    + Yeni Ders Oluştur
                </button>
                <button className="bg-pink-300 hover:bg-pink-400 text-white px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105">
                    Kazançlarım
                </button>
            </div>

            {/* İçerik Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full max-w-6xl">
                {/* Geri Bildirim Kartı */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-200 p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-5 text-center">
                        💬 Öğrenci Geri Bildirimleri
                    </h2>
                    <div className="space-y-4">
                        {feedbacks.map((text, index) => (
                            <div
                                key={index}
                                className="p-4 bg-pink-50 border border-pink-200 rounded-2xl text-gray-700 text-sm hover:bg-pink-100 transition"
                            >
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Takvim */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-200 flex flex-col justify-center items-center p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-3">📅 Ders Takvimi</h2>
                    <Calendar
                        onClickDay={handleDateClick}
                        value={date}
                        onChange={setDate}
                        tileClassName={tileClassName}
                        showNeighboringMonth={true}
                        formatShortWeekday={(locale, date) =>
                            ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"][date.getDay()]
                        }
                        className="rounded-xl shadow-inner p-2"
                    />
                </div>

                {/* Grafik */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-200 p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-5 text-center">📈 İstatistikler</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={data}>
                            <XAxis dataKey="name" stroke="#fb7185" />
                            <YAxis stroke="#fb7185" />
                            <Tooltip />
                            <Bar dataKey="value" fill="#f472b6" radius={[15, 15, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 border border-pink-200">
                        <h2 className="text-2xl font-semibold text-pink-600 mb-5 text-center">
                            {selectedDate} - Ders Detayları
                        </h2>

                        {lessons[selectedDate] ? (
                            <ul className="space-y-4">
                                {lessons[selectedDate].map((lesson, i) => (
                                    <li
                                        key={i}
                                        className="border border-pink-200 rounded-2xl p-4 bg-pink-50 text-gray-700 hover:bg-pink-100 transition"
                                    >
                                        👩‍🎓 <b>{lesson.student}</b> <br />
                                        🕒 Saat: {lesson.start} - {lesson.end} <br />
                                        💰 Kazanç: {lesson.earning} ₺
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center">Bu günde ders bulunmuyor.</p>
                        )}

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-8 w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl shadow-md transition-transform hover:scale-105"
                        >
                            Kapat
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default InstructorPage;