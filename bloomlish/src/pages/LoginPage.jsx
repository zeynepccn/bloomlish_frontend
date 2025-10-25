import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {

    const navigate = useNavigate();
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
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const text = await response.text();
            let data = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch (err) {
                console.error("JSON parse hatası:", err);
            }
            if (!response.ok) {
                alert("Giriş başarısız: " + (data?.message || response.status));
                return;
            }
            alert("Giriş başarılı!");
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            setIsLoggedIn(true);
            navigate("/");

        }

        catch (error) {
            console.error("Giriş hatası:", error);
            alert("Sunucuya bağlanırken hata oluştu.");
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
