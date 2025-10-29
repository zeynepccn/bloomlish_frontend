import React, { useState } from "react";

function CreateLessonPage() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        price: "",
        resources: {},
    });

    const resourceOptions = ["PDF", "Video", "Doküman"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileUpload = (type, file) => {
        setForm((prev) => ({
            ...prev,
            resources: { ...prev.resources, [type]: file },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.date) {
            alert(" Lütfen önce tarih seçiniz!");
            return;
        }
        console.log("Yeni ders:", form);
        alert(` Ders başarıyla oluşturuldu!\n ${form.date}  ${form.startTime} - ${form.endTime}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-2xl border border-pink-200 rounded-3xl w-full max-w-lg p-8 transition-all duration-300 hover:shadow-pink-200">
                <h1 className="text-3xl font-bold text-pink-700 text-center mb-10 tracking-wide">
                    🌸 Yeni Ders Oluştur
                </h1>

                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Ders Başlığı */}
                    <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-1">
                            Ders Başlığı
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Örn: İngilizce Konuşma Pratiği"
                            className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:outline-none shadow-sm"
                            required
                        />
                    </div>

                    {/* Açıklama */}
                    <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-1">
                            Açıklama
                        </label>
                        <textarea
                            name="description"
                            rows="3"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Bu dersin içeriği hakkında kısa bir açıklama yaz..."
                            className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:outline-none shadow-sm resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* Tarih */}
                    <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-1">
                            Tarih
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:outline-none shadow-sm"
                            required
                        />
                    </div>

                    {/* Saat Aralığı */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-pink-700 mb-1">
                                Başlangıç Saati
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                disabled={!form.date}
                                className={`w-full px-4 py-2.5 rounded-2xl border shadow-sm focus:ring-2 focus:outline-none ${form.date
                                        ? "border-pink-200 focus:ring-pink-300"
                                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                required={!!form.date}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pink-700 mb-1">
                                Bitiş Saati
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                disabled={!form.date}
                                className={`w-full px-4 py-2.5 rounded-2xl border shadow-sm focus:ring-2 focus:outline-none ${form.date
                                        ? "border-pink-200 focus:ring-pink-300"
                                        : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}
                                required={!!form.date}
                            />
                        </div>
                    </div>

                    {/* Fiyat */}
                    <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-1">
                            Fiyat
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-4 py-2.5 rounded-2xl border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:outline-none shadow-sm"
                                required
                            />
                            <span className="absolute right-4 top-2.5 text-gray-400 font-semibold">₺</span>
                        </div>
                    </div>

                    {/* Kaynaklar */}
                    <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-3">
                            Kaynaklar
                        </label>
                        <div className="flex flex-col gap-4">
                            {resourceOptions.map((r) => (
                                <div key={r}>
                                    <label className="flex items-center justify-between px-4 py-2 border border-pink-200 rounded-2xl bg-pink-50 hover:bg-pink-100 transition cursor-pointer shadow-sm">
                                        <span className="font-medium text-pink-700">{r}</span>
                                        <input
                                            type="file"
                                            accept={
                                                r === "PDF"
                                                    ? ".pdf"
                                                    : r === "Video"
                                                        ? "video/*"
                                                        : ".doc,.docx,.txt,.md"
                                            }
                                            onChange={(e) => handleFileUpload(r, e.target.files[0])}
                                            className="text-sm text-gray-500"
                                        />
                                    </label>

                                    {form.resources[r] && (
                                        <div className="flex items-center gap-2 mt-1 ml-2 text-gray-600 text-sm">
                                            <span>📎 {form.resources[r].name}</span>
                                            <span className="text-green-600 font-semibold">✓</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Oluştur Butonu */}
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-2xl shadow-md transition-transform hover:scale-105"
                    >
                        OLUŞTUR
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateLessonPage;
