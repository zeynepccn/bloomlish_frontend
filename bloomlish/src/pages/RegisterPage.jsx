import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
function RegisterPage() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const fromTrial = params.get("from") === "trial";
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "ogrenci",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError(" Şifreler eşleşmiyor!");
            return;
        }
        if (formData.password.length < 6 || formData.password.length > 12) {
            setError(" Şifre 6 ile 12 karakter arasında olmalıdır!");
            return;
        }


        try {
            setLoading(true);
            const { data } = await api.post(
                "/api/auth/register",
                {
                    username: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.userType === "ogrenci"
                        ? "ROLE_STUDENT"
                        : "ROLE_INSTRUCTOR",
                }
            );

            alert(" Kayıt başarılı!");
            navigate(fromTrial ? "/login?from=trial" : "/login");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Kayıt sırasında bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-pink-700 mb-6 text-center">
                    Kayıt Ol
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 flex items-center gap-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Username"
                        className="border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="E-posta"
                        className="border border-pink-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        required
                    />


                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Şifre"
                            className="border border-pink-200 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-500 select-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Şifreyi Onayla"
                            className="border border-pink-200 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-pink-300"
                            required
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-pink-500 select-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="userType"
                                value="ogrenci"
                                checked={formData.userType === "ogrenci"}
                                onChange={handleChange}
                                className="accent-pink-500"
                            />
                            Öğrenci
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="userType"
                                value="egitmen"
                                checked={formData.userType === "egitmen"}
                                onChange={handleChange}
                                className="accent-pink-500"
                            />
                            Eğitmen
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-pink-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-pink-600 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
                    </button>
                </form>

                <p className="text-sm text-pink-600 mt-4 text-center">
                    Zaten hesabın var mı?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="font-semibold cursor-pointer hover:underline"
                    >
                        Giriş Yap
                    </span>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
