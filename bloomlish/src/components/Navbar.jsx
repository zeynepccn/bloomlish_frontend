import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        setIsMenuOpen(false);
        navigate("/");
    };

    const goProfile = () => {
        setIsMenuOpen(false);
        navigate("/profile");
    };

    const goPremium = () => {
        setIsMenuOpen(false);
        navigate("/premium");
    };

    return (
        <nav className="w-full flex justify-between items-center px-10 py-4 shadow-sm bg-white fixed top-0 left-0 z-50">
            <h1
                className="text-2xl font-bold text-pink-400 cursor-pointer"
                onClick={() => navigate("/")}
            >
                BLOOMLISH
            </h1>

            <div className="flex gap-4 items-center">
                {isLoggedIn ? (
                    <>
                        {/* Ana sayfa butonu */}
                        <button
                            onClick={() => navigate("/")}
                            className="border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-pink-50 transition"
                        >
                            Ana Sayfa
                        </button>

                        {/* Profil ikonu + açılır menü */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 hover:bg-pink-50 transition"
                            >
                                <FaUserCircle className="text-xl text-pink-400" />
                            </button>

                            {isMenuOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 text-sm origin-top animate-[dropdown_0.15s_ease-out]"
                                >
                                    <button
                                        onClick={goProfile}
                                        className="w-full text-left px-4 py-2 hover:bg-pink-50"
                                    >
                                        Profilim
                                    </button>
                                    <button
                                        onClick={goPremium}
                                        className="w-full text-left px-4 py-2 hover:bg-pink-50"
                                    >
                                        Premium’a Geç
                                    </button>
                                    <div className="border-t border-gray-100 my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="border border-gray-300 rounded-md px-4 py-1 text-sm hover:bg-gray-100 transition"
                        >
                            Giriş Yap
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="border border-gray-300 rounded-md px-4 py-1 text-sm hover:bg-gray-100 transition"
                        >
                            Kayıt Ol
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
