
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateLessonPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        price: "",
        category: "",
        level: "",
        resources: [],
    });

    const categoryOptions = [
        "Grammar",
        "Vocabulary",
        "Speaking",
        "Writing",
        "Listening",
        "Exam Preparation",
    ];

    const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];


    const handleFileUpload = (files) => {
        setForm({ ...form, resources: Array.from(files) });
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.endTime <= form.startTime) {
            alert("Bitiş saati başlangıç saatinden önce olamaz!");
            return;
        }
        

        const dto = {
            name: form.name,
            description: form.description,
            date: form.date,
            startTime: form.startTime,
            endTime: form.endTime,
            price: Number(form.price),
            category: form.category,
            level: form.level,
            resourcePaths: [],
        };

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();

            
            formData.append(
                "dto",
                new Blob([JSON.stringify(dto)], { type: "application/json" })
            );

            
            if (form.resources && form.resources.length > 0) {
                form.resources.forEach((file) => {
                    formData.append("files", file);
                });
            }

            await axios.post("http://localhost:8080/api/lessons/create", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            

            alert("Ders başarıyla oluşturuldu!");
            navigate("/lessons"); 

        } catch (error) {
            console.error("Hata:", error);
            alert("Ders oluşturulamadı!");
        }
    };
    
    const todayString = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold text-pink-700 mb-8 text-center">
                    Yeni Ders Oluştur
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ders adı */}
                    <div>
                        <label className="font-semibold text-pink-700">Ders Başlığı</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                            required
                        />
                    </div>

                    {/* Açıklama */}
                    <div>
                        <label className="font-semibold text-pink-700">Açıklama</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                            required
                        ></textarea>
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="font-semibold text-pink-700">Kategori</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                            required
                        >
                            <option value="">Seçiniz</option>
                            {categoryOptions.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Seviye */}
                    <div>
                        <label className="font-semibold text-pink-700">Seviye</label>
                        <select
                            name="level"
                            value={form.level}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                            required
                        >
                            <option value="">Seçiniz</option>
                            {levelOptions.map((lvl) => (
                                <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                        </select>
                    </div>

                    {/* Tarih */}
                    <div>
                        <label className="font-semibold text-pink-700">Tarih</label>
                        <input
                            type="date"
                            name="date"
                            min={todayString}
                            value={form.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                            required
                        />
                    </div>

                    {/* Saatler */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold text-pink-700">Başlangıç</label>
                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-pink-700">Bitiş</label>
                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                                required
                            />
                        </div>
                    </div>

                    {/* Fiyat */}
                    <div>
                        <label className="font-semibold text-pink-700">Fiyat</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-pink-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-pink-700 mb-3">
                            Kaynaklar
                        </label>

                        <label className="flex items-center justify-between px-4 py-2 border border-pink-200 rounded-2xl bg-pink-50 hover:bg-pink-100 transition cursor-pointer shadow-sm">
                            <span className="font-medium text-pink-700">Dosya Yükle</span>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="text-sm text-gray-500"
                            />

                        </label>

                        {form.resources.length > 0 && form.resources.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                                <span>📎 {file.name}</span>
                                <span className="text-green-600 font-semibold">✓</span>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-pink-500 rounded-xl hover:bg-pink-600"
                    >
                        OLUŞTUR
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateLessonPage; 

