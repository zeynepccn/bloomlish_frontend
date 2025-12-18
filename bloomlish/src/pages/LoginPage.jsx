import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import api from "../api";

function LoginPage({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const location = useLocation();

    // ?from=trial parametresini oku
    const params = new URLSearchParams(location.search);
    const fromTrial = params.get("from") === "trial";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Lütfen tüm alanları doldurunuz!");
            return;
        }

        try {

            const response = await api.post("/api/auth/login", formData);
            const data = response.data;


            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("email", data.email);

            setIsLoggedIn(true);

            if (fromTrial) {
                try {
                    await api.post("/api/billing/start-trial", null, {
                        headers: { Authorization: `Bearer ${data.token}` }
                    });

                    alert("3 günlük ücretsiz denemen başladı! 🎉");
                    navigate("/premium");
                } catch (err) {
                    console.error("Deneme hatası:", err);
                    alert("Deneme başlatılırken hata oluştu.");
                    navigate("/");
                }
            } else {
                alert("Giriş başarılı!");
                navigate("/");
            }

        } catch (err) {
            if (err.response?.status === 401) {
                message.error(err.response.data.message);
            } else {
                message.error("Bir hata oluştu");
            }
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
                    Giriş Yap
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="E-posta"
                        className="border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Şifre"
                        className="border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-pink-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-pink-600 transition"
                    >
                        Giriş Yap
                    </button>
                </form>

                <p className="text-sm text-pink-600 mt-4 text-center">
                    Hesabın yok mu?{" "}
                    <span
                        onClick={() => navigate("/register")}
                        className="font-semibold cursor-pointer hover:underline"
                    >
                        Kayıt Ol
                    </span>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
