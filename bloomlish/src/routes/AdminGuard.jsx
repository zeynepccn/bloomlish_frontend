import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toUpperCase();

    if (!token) return <Navigate to="/login" replace />;
    if (role !== "ROLE_ADMIN") return <Navigate to="/" replace />;

    return children;
}
