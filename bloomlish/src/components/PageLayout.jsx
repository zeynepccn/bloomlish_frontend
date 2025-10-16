import React from "react";
import { Button } from "antd";
import { NavLink } from "react-router-dom"; // unutma
import { useNavigate } from "react-router-dom";

export default function PageLayout({ title, children }) {
    const navigate = useNavigate(); // navigate hook'u

    return (
        <div className="flex flex-col items-center py-10">
            {/* Sayfa başlığı */}
            <h1 className="text-3xl font-extrabold text-pink-700 mb-6 tracking-wide">
                {title}
            </h1>

            {/* Blog / Günlük sekmeleri */}
            <div className="flex gap-4 mb-8 justify-center">
                <NavLink to="/blog">
                    {({ isActive }) => (
                        <Button
                            style={{
                                backgroundColor: isActive ? "#ec4899" : "#fce7f3",
                                borderColor: isActive ? "#ec4899" : "#fce7f3",
                                color: isActive ? "white" : "#be185d",
                            }}
                        >
                            Blog
                        </Button>
                    )}
                </NavLink>

                <NavLink to="/gunluk">
                    {({ isActive }) => (
                        <Button
                            style={{
                                backgroundColor: isActive ? "#ec4899" : "#fce7f3",
                                borderColor: isActive ? "#ec4899" : "#fce7f3",
                                color: isActive ? "white" : "#be185d",
                            }}
                        >
                            Günlüğüm
                        </Button>
                    )}
                </NavLink>
            </div>

            {/* Sayfanın kendi içeriği */}
            <div className="w-full max-w-2xl">{children}</div>
        </div>
    );
}
