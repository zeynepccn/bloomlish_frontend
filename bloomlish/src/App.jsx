// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import GunlukPage from "./components/GunlukPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-auto min-h-0 bg-pink-100">

        {/* Navbar üstte sabit */}
        <Navbar />
        <div className="flex flex-col items-center py-10">
          <Routes>
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/gunluk" element={<GunlukPage />} />
            <Route path="*" element={<BlogPage />} /> {/* Default */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
