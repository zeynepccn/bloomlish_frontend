import React from "react";
import { useNavigate } from "react-router-dom";
import ResultsOverviewSection from "../components/ResultsOverviewSection";

function ResultsOverviewPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 space-y-6">
            <div className="w-full max-w-4xl flex justify-between items-center">
                <h1 className="text-2xl font-bold">Sonuçlarım & İstatistiklerim</h1>
                <button
                    onClick={() => navigate("/quiz")}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Quiz sayfasına dön
                </button>
            </div>

            <ResultsOverviewSection />
        </div>
    );
}

export default ResultsOverviewPage;