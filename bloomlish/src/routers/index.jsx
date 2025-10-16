import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../component/Navbar"; 
import Home from "../pages/HomePage"; 

function AppRouter() {
    return (
        <div>
            <Navbar /> {/* Navbar tüm sayfalarda görünür */}
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </div>
    );
}

export default AppRouter;
