import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function MyLessonsPage() {
    const [lessons, setLessons] = useState([]);
    const [page, setPage] = useState(1);
    const lessonsPerPage = 4;

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("http://localhost:8080/api/lessons/my-lessons", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => setLessons(res.data))
            .catch((err) => console.error(err));
    }, []);

    const startIndex = (page - 1) * lessonsPerPage;
    const paginatedLessons = lessons.slice(startIndex, startIndex + lessonsPerPage);

    const totalPages = Math.ceil(lessons.length / lessonsPerPage);

    const handleDelete = async (lessonId) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Bu dersi silmek istediğine emin misin?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/lessons/${lessonId}`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            setLessons((prev) => prev.filter((l) => l.id !== lessonId));
        } catch (err) {
            console.error(err);
            alert("Ders silinirken bir hata oluştu!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-10 flex flex-col items-center">

            {/* ÜST KONTROL BARI */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8">
                <button
                    onClick={() => navigate("/instructor")}
                    className="px-5 py-2 rounded-full border border-pink-300 bg-white shadow hover:bg-pink-50 transition"
                >
                    ← Eğitmen Paneli
                </button>

                <button
                    onClick={() => navigate("/createlesson")}
                    className="px-5 py-2 rounded-full bg-pink-500 text-white shadow hover:bg-pink-600 transition"
                >
                    + Yeni Ders Oluştur
                </button>
            </div>

            {/* BAŞLIK */}
            <h1 className="text-4xl font-bold text-pink-700 mb-6 drop-shadow">
                Derslerim
            </h1>

            {/* DERSTEN GELEN BAŞARI BİLGİSİ */}
            {location.state?.from === "create" && (
                <div className="mb-6 w-full max-w-4xl p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm shadow">
                    🎉 Ders başarıyla oluşturuldu!
                </div>
            )}

            {/* BOŞ DURUM */}
            {lessons.length === 0 && (
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-pink-200 text-center max-w-lg mt-10">
                    <p className="text-xl text-gray-600 mb-4">Henüz ders oluşturmadınız.</p>
                    <button
                        onClick={() => navigate("/createlesson")}
                        className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
                    >
                        İlk dersini oluştur ✨
                    </button>
                </div>
            )}

            {/* DERS LİSTESİ */}
            <div className="w-full max-w-4xl space-y-6 mt-4">
                {paginatedLessons.map((lesson) => (
                    <div
                        key={lesson.id}
                        className="bg-white p-6 rounded-3xl shadow-xl border border-pink-200 hover:shadow-2xl transition"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-2xl font-semibold text-pink-600">
                                {lesson.name}
                            </h2>

                            <span className="text-pink-600 font-bold text-xl">
                                {lesson.price} TL
                            </span>
                        </div>

                        <div className="flex gap-3 mb-3">
                            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                                {lesson.category}
                            </span>
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                {lesson.level}
                            </span>
                        </div>

                        <p className="text-gray-700">
                            <b>Tarih:</b> {lesson.date}
                        </p>
                        <p className="text-gray-700">
                            <b>Saat:</b> {lesson.startTime} - {lesson.endTime}
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => navigate(`/editlesson/${lesson.id}`)}
                                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-xl shadow transition transform hover:scale-105"
                            >
                                Düzenle
                            </button>

                            <button
                                onClick={() => handleDelete(lesson.id)}
                                className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded-xl shadow transition transform hover:scale-105"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* SAYFALAMA */}
            {lessons.length > lessonsPerPage && (
                <div className="flex items-center gap-4 mt-10">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-6 py-2 rounded-xl shadow-md text-white transition ${page === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-pink-400 hover:bg-pink-500"
                            }`}
                    >
                        Önceki
                    </button>

                    <span className="text-pink-700 font-semibold text-lg px-4 py-2 rounded-xl bg-white shadow border border-pink-200">
                        {page} / {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-6 py-2 rounded-xl shadow-md text-white transition ${page === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-pink-400 hover:bg-pink-500"
                            }`}
                    >
                        Sonraki
                    </button>
                </div>
            )}
        </div>
    );
}

export default MyLessonsPage;
