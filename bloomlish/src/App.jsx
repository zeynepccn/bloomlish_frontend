import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import BlogPage from "./components/BlogPage";
import GunlukPage from "./components/GunlukPage";
import BloomlishStartScreen from "./pages/BloomlishStartScreen";  
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/blog" element={<BlogPage/>} />
          <Route path="/gunluk" element={<GunlukPage/>} />
          <Route path="/start" element={<BloomlishStartScreen/>} />
        </Routes>
      </div>
      <ChatWidget />
    </Router>
  );
}

export default App;
