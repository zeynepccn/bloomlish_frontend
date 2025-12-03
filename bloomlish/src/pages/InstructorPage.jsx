import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";


import { User, BookOpen, Clock, MessageSquare, Star } from "lucide-react";

function InstructorPage() {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const navigate = useNavigate();

    const [lessons, setLessons] = useState({});
    



    const feedbacks = [
        { student: "Zeynep A.", lesson: "Present Perfect Tense", text: "Hocam konuyu çok güzel anlattınız.", rating: 5, date: "2025-10-28", time: "14:35" },
        { student: "Ali K.", lesson: "Speaking Practice #2", text: "Konuşma pratiği çok eğlenceliydi.", rating: 4, date: "2025-10-25", time: "16:10" },
        { student: "Deniz M.", lesson: "Grammar Basics", text: "Ders çok verimliydi, örnekler anlaşılırdı.", rating: 5, date: "2025-10-22", time: "11:45" },
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
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");

        const formatted = `${y}-${m}-${d}`;
        if (!lessons[formatted]) return "";

        const today = new Date().toISOString().split("T")[0];
        if (formatted < today) return "past-lesson-day";

        return "lesson-day";
    };




    const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);


    useEffect(() => {
        axios
            .get("http://localhost:8080/api/lessons/my-lessons", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                console.log("my-lessons response:", res.data); // bir kere bakmak için

                const grouped = {};

                res.data.forEach((lesson) => {
                    const rawDate = lesson.date;
                    if (!rawDate) return;

                    const dateKey = rawDate.split("T")[0]; // "YYYY-MM-DD"

                    if (!grouped[dateKey]) grouped[dateKey] = [];

                    grouped[dateKey].push({
                        student: lesson.instructor?.username || "Öğrenci",
                        start: lesson.startTime,
                        end: lesson.endTime,
                        earning: lesson.price,
                    });
                });

                setLessons(grouped);
            })
            .catch((err) => console.error(err));
    }, []);




    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center p-10 space-y-10">

            {/* ← Ana Sayfa */}
            <button
                onClick={() => navigate("/")}
                className="self-start mb-4 px-5 py-2 rounded-full border border-pink-300 text-pink-600 
                           bg-white shadow-sm hover:bg-pink-50 transition flex items-center gap-2"
            >
                ← Ana Sayfa
            </button>

            <h1 className="text-4xl font-bold text-pink-700 drop-shadow-sm tracking-wide">
                Eğitmen Paneli
            </h1>

            {/* Üst Butonlar */}
            <div className="flex flex-wrap justify-center gap-4">
                <button
                    onClick={() => navigate("/createlesson")}
                    className="bg-pink-400 hover:bg-pink-500 text-white px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105"
                >
                    + Yeni Ders Oluştur
                </button>
                <button
                    onClick={() => navigate("/earnings")}
                    className="bg-pink-300 hover:bg-pink-400 text-white px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105"
                >
                    Kazançlarım
                </button>
                <button
                    onClick={() => navigate("/mylessons")}
                    className="bg-pink-300 hover:bg-pink-400 text-white px-8 py-3 rounded-2xl shadow-md transition-transform hover:scale-105"
                >
                    Derslerim
                </button>
            </div>

            {/* İçerik Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full max-w-6xl">
                {/* 💬 Geri Bildirim Kartı */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-200 p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-5 text-center">
                        Öğrenci Geri Bildirimleri
                    </h2>

                    <div className="space-y-4">
                        {feedbacks.map((f, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedFeedback(f)}
                                className="p-4 bg-pink-50 border border-pink-200 rounded-2xl text-gray-700 cursor-pointer hover:bg-pink-100 transition"
                            >
                                <p className="text-gray-800 italic mb-2">“{f.text}”</p>
                                <div className="text-xs text-gray-600 flex justify-between">
                                    <span>{f.date}</span>
                                    <span>{f.rating}/5 ★</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 📅 Takvim */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-200 flex flex-col justify-center items-center p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-3">Ders Takvimi</h2>

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

                {/* 📈 İstatistik Grafiği */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-200 p-6 hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold text-pink-600 mb-5 text-center">
                        İstatistikler
                    </h2>

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

            {/* Ders Modalı */}
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
                                        <User className="inline w-4 h-4 text-pink-500 mr-1" /> <b>{lesson.student}</b>
                                        <br />
                                        <Clock className="inline w-4 h-4 text-pink-500 mr-1" /> Saat: {lesson.start} - {lesson.end}
                                        <br />
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

            {/* Geri Bildirim Modalı */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 border border-pink-200">
                        <h2 className="text-2xl font-semibold text-pink-600 mb-5 text-center">
                            Geri Bildirim Detayı
                        </h2>

                        <div className="text-gray-700 text-sm space-y-2">
                            <p><User className="inline w-4 h-4 text-pink-500 mr-1" /> <b>Öğrenci:</b> {selectedFeedback.student}</p>
                            <p><BookOpen className="inline w-4 h-4 text-pink-500 mr-1" /> <b>Ders:</b> {selectedFeedback.lesson}</p>
                            <p><Clock className="inline w-4 h-4 text-pink-500 mr-1" /> <b>Tarih:</b> {selectedFeedback.date} • {selectedFeedback.time}</p>
                            <p><MessageSquare className="inline w-4 h-4 text-pink-500 mr-1" /> <b>Yorum:</b> “{selectedFeedback.text}”</p>
                            <p><Star className="inline w-4 h-4 text-pink-500 mr-1" /> <b>Puan:</b> {selectedFeedback.rating}/5</p>
                        </div>

                        <button
                            onClick={() => setSelectedFeedback(null)}
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
