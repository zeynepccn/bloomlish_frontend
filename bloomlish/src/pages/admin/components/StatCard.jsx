import React from "react";

export default function StatCard({ title, value }) {
    return (
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-3xl font-bold text-pink-700">{value}</div>
        </div>
    );
}
