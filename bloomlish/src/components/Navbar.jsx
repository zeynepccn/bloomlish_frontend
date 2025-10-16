// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="w-full bg-pink-200 p-4 flex justify-between items-center shadow-md mb-6">
            {/* Sol: Uygulama Adı */}
            <h1 className="text-2xl font-bold text-pink-700">Bloomlish</h1>

            {/* Orta: Sekmeler */}
            <div className="flex gap-4">
                {["Dersler", "Testler", "Oyunlar", "Yazılar"].map((item) => (
                    <NavLink
                        key={item}
                        to={`/${item.toLowerCase()}`}
                        className={({ isActive }) =>
                            `px-3 py-1 rounded-lg font-semibold transition-all duration-300 ${isActive
                                ? "bg-pink-500 text-white shadow-lg transform scale-105"
                                : "text-pink-700 hover:bg-pink-300 hover:text-pink-800"
                            }`
                        }
                    >
                        {item}
                    </NavLink>
                ))}
            </div>

            {/* Sağ: Profil ikonu */}
            <NavLink
                to="/profile"
                className="bg-pink-300 p-2 rounded-full hover:bg-pink-400 transition"
            >
                <span className="material-icons text-pink-600">person</span>
            </NavLink>
        </nav>
    );
}

export default Navbar;
