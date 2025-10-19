import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

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
                        <button
                            onClick={() => navigate("/")}
                            className="border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-pink-50 transition"
                        >
                            Ana Sayfa
                        </button>
                        <button
                            onClick={() => setIsLoggedIn(false)}
                            className="border border-gray-300 rounded-md px-4 py-1 text-sm hover:bg-gray-100 transition"
                        >
                            Çıkış Yap
                        </button>
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
