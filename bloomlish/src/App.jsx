import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import GunlukPage from "./components/GunlukPage";
import RegisterPage from "./components/RegisterPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-auto min-h-0 bg-pink-100">
        <Navbar />
        <div className="flex flex-col items-center py-10">
          <Routes>
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/gunluk" element={<GunlukPage />} />
            <Route path="*" element={<BlogPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
