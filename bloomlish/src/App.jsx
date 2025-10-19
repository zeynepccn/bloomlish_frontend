import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BloomlishStartScreen from "./pages/BloomlishStartScreen";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfa */}
        <Route path="/" element={<BloomlishStartScreen />} />


        {/* Giriş sayfası */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
