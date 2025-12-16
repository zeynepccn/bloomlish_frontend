import React from "react";
import MatchGameCard from "./MatchGameCard";

export default function MatchGamePage() {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
            <div className="w-full max-w-6xl">
                <MatchGameCard />
            </div>
        </div>
    );
}
