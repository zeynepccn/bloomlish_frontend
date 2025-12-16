import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function EditLessonPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem("token");

        api.get(`/api/lessons/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setForm(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Yeni Kaynak Yükleme
    const handleFileUpload = async (files) => {
        const token = localStorage.getItem("token");

        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await api.post(
                    `/api/lessons/${id}/upload-resource`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setForm((prev) => ({
                    ...prev,
                    resourcePaths: [...prev.resourcePaths, res.data],
                }));
            } catch (err) {
                console.error("Dosya yüklenemedi:", err);
                alert("Dosya yüklenirken hata oluştu.");
            }
        }
    };

    // Kaynak Silme
    const handleDeleteResource = async (fileName) => {
        const token = localStorage.getItem("token");

        try {
            await api.delete(
                `/api/lessons/${id}/resource/${encodeURIComponent(fileName)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setForm((prev) => ({
                ...prev,
                resourcePaths: prev.resourcePaths.filter((f) => f !== fileName),
            }));
        } catch (err) {
            console.error("Silme hatası:", err);
            alert("Kaynak silinirken hata oluştu.");
        }
    };

    //  Ders Bilgilerini Kaydetme
    const handleSave = async () => {
        const token = localStorage.getItem("token");

        try {
            await api.put(`/api/lessons/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Ders başarıyla güncellendi!");
            navigate("/mylessons");
        } catch (error) {
            console.error(error);
            alert("Güncelleme sırasında hata oluştu.");
        }
    };

    if (!form) return <p>Yükleniyor...</p>;

    return (
        <div className="p-10 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-pink-600 mb-6">
                Dersi Düzenle
            </h1>

            <div className="space-y-4">
                <input
                    className="w-full p-3 border rounded-xl"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ders Adı"
                />

                <textarea
                    className="w-full p-3 border rounded-xl"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Açıklama"
                />

                <input
                    className="w-full p-3 border rounded-xl"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                />

                <input
                    className="w-full p-3 border rounded-xl"
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                />

                <input
                    className="w-full p-3 border rounded-xl"
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                />

                <input
                    className="w-full p-3 border rounded-xl"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Fiyat"
                />

                {/* Kaynak Yükleme */}
                <div>
                    <label className="block text-sm font-semibold text-pink-700 mb-2">
                        Kaynaklar
                    </label>

                    <label className="flex items-center justify-between px-4 py-2 border border-pink-200 rounded-xl bg-pink-50 hover:bg-pink-100 transition cursor-pointer shadow-sm">
                        <span className="font-medium text-pink-700">
                            Dosya Yükle
                        </span>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                handleFileUpload(e.target.files)
                            }
                            className="hidden"
                        />
                    </label>

                    {/*  Kaynak Listesi */}
                    {form.resourcePaths?.length > 0 &&
                        form.resourcePaths.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 mt-3 bg-gray-100 rounded-lg text-sm"
                            >
                                <a
                                    href={`${BASE_URL}/uploads/resources/${file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                     {file}
                                </a>

                                <button
                                    onClick={() =>
                                        handleDeleteResource(file)
                                    }
                                    className="text-red-600 font-bold hover:text-red-800 ml-4"
                                >
                                    Sil ✕
                                </button>
                            </div>
                        ))}
                </div>

                <button
                    onClick={handleSave}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl shadow w-full"
                >
                    Kaydet
                </button>
            </div>
        </div>
    );
}

export default EditLessonPage;
