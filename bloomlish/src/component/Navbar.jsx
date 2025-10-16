import React from 'react'

function Navbar() {
    return (
        <nav className="w-full flex justify-between items-center px-10 py-12 shadow-sm">
            <h1 className="text-2xl font-bold text-pink-300">BLOOMLISH</h1>
            <div className="flex gap-4">
                <button className="border border-gray-400 rounded-full px-4 py-1 text-sm hover:bg-pink-50">
                    Dersler
                </button>
                <button className="border border-gray-400 rounded-full px-4 py-1 text-sm hover:bg-pink-50">
                    Testler
                </button>
                <button className="border border-gray-400 rounded-full px-4 py-1 text-sm hover:bg-pink-50">
                    Oyunlar
                </button>
                <button className="border border-gray-400 rounded-full px-4 py-1 text-sm hover:bg-pink-50">
                    Yazılar
                </button>
            </div>
            <div className="flex gap-3 items-center">
                <button className="border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100">
                    Giriş Yap
                </button>
                <button className="border border-gray-400 rounded-md px-4 py-1 hover:bg-gray-100">
                    Kayıt Ol
                </button>
                <div className="w-6 h-6 rounded-full bg-gray-300"></div>
            </div>
        </nav>

    );
}

export default Navbar;