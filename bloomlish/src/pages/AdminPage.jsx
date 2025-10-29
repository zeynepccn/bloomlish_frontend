import React, { useState } from "react";

function AdminPage() {
    // Kullanıcı listesi
    const [users, setUsers] = useState([
        { id: 1, name: "Zeynep Yılmaz", role: "Öğrenci" },
        { id: 2, name: "Deniz Metin", role: "Admin" },
    ]);

    // Ders içerikleri
    const [lessons, setLessons] = useState([
        { id: 1, title: "Grammar Basics" },
        { id: 2, title: "Speaking Practice" },
    ]);

    // Ödemeler
    const [payments, setPayments] = useState([
        { id: 1, student: "Zeynep Yılmaz", lesson: "Speaking Practice", amount: "200 TL", status: "Ödendi" },
        { id: 2, student: "Ahmet Kaya", lesson: "Grammar Basics", amount: "200 TL", status: "Ödenmedi" },
        { id: 3, student: "Elif Demir", lesson: "Vocabulary Practice", amount: "300 TL", status: "Ödendi" },
    ]);

    // Kullanıcı silme
    const handleDeleteUser = (id) => {
        if (window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
            setUsers(users.filter((u) => u.id !== id));
        }
    };

    // İçerik kaldırma (onaylı)
    const handleRemoveLesson = (id) => {
        const selected = lessons.find((l) => l.id === id);
        if (window.confirm(`"${selected.title}" içeriğini kaldırmak istediğinize emin misiniz?`)) {
            setLessons(lessons.filter((l) => l.id !== id));
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 p-10">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10 text-gray-800">
                <h1 className="text-3xl font-bold text-center text-pink-700 mb-10">
                    🌸 ADMIN PANEL
                </h1>

                {/* Kullanıcı Yönetimi */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-pink-600 mb-4">
                        Kullanıcı Yönetimi
                    </h2>
                    <table className="w-full border border-pink-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-pink-100">
                                <th className="p-2 text-left">Kullanıcı</th>
                                <th className="p-2 text-left">Rol</th>
                                <th className="p-2 text-left">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-pink-50">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.role}</td>
                                    <td className="p-2 space-x-2">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-rose-300 text-white px-3 py-1 rounded-md hover:bg-rose-400"
                                        >
                                            Sil
                                        </button>
                                        <button className="bg-rose-300 text-white px-3 py-1 rounded-md hover:bg-rose-400">
                                            Düzenle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Ders İçerikleri */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-pink-600 mb-3">
                        Ders İçerikleri
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 mb-3 space-y-2">
                        {lessons.map((lesson) => (
                            <li key={lesson.id} className="flex justify-between items-center">
                                <span>{lesson.title}</span>
                                <button
                                    onClick={() => handleRemoveLesson(lesson.id)}
                                    className="bg-rose-400 text-white px-3 py-1 rounded-md hover:bg-rose-500 text-sm"
                                >
                                     Kaldır
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Ödeme Süreçleri */}
                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-pink-600 mb-4">
                        Ödeme Süreçleri
                    </h2>
                    <table className="w-full border border-pink-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-pink-100">
                                <th className="p-2 text-left">Öğrenci</th>
                                <th className="p-2 text-left">Ders</th>
                                <th className="p-2 text-left">Tutar</th>
                                <th className="p-2 text-left">Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p) => (
                                <tr key={p.id} className="border-b hover:bg-pink-50">
                                    <td className="p-2">{p.student}</td>
                                    <td className="p-2">{p.lesson}</td>
                                    <td className="p-2">{p.amount}</td>
                                    <td
                                        className={`p-2 font-semibold ${p.status === "Ödendi"
                                            ? "text-green-600"
                                            : "text-red-500"
                                            }`}
                                    >
                                        {p.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* İstatistikler */}
                <section className="text-center">
                    <h2 className="text-lg font-semibold text-pink-600 mb-6">
                        İstatistikler ve Raporlar
                    </h2>
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-24 bg-pink-100 rounded-lg flex items-end justify-around p-2">
                                <div className="w-6 bg-pink-500 h-10 rounded-md"></div>
                                <div className="w-6 bg-pink-400 h-16 rounded-md"></div>
                                <div className="w-6 bg-pink-300 h-8 rounded-md"></div>
                            </div>
                            <p className="mt-2 font-medium text-gray-700">
                                Ders İstatistikleri
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-40 h-24 bg-pink-100 rounded-lg flex items-end justify-around p-2">
                                <div className="w-6 bg-pink-500 h-12 rounded-md"></div>
                                <div className="w-6 bg-pink-400 h-20 rounded-md"></div>
                                <div className="w-6 bg-pink-300 h-6 rounded-md"></div>
                            </div>
                            <p className="mt-2 font-medium text-gray-700">
                                Aktif Kullanıcı
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminPage;
