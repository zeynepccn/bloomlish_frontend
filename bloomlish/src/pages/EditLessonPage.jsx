import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditLessonPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get(`http://localhost:8080/api/lessons/${id}`, {
                headers: { Authorization: "Bearer " + token },
            })
            .then((res) => setForm(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSave = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.put(
                `http://localhost:8080/api/lessons/${id}`,
                form,
                {
                    headers: { Authorization: "Bearer " + token },
                }
            );

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
            <h1 className="text-3xl font-bold text-pink-600 mb-6">Dersi Düzenle</h1>

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
