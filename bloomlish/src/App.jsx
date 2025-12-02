import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWidget from "./components/ChatWidget";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import GunlukPage from "./components/GunlukPage";
import BloomlishStartScreen from "./pages/BloomlishStartScreen";
import RegisterPage from "./pages/RegisterPage";
import BlogPage from "./components/BlogPage";
import Foooter from "./components/Footer";
import LessonsPage from "./components/LessonsPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import BillingSketchPage from "./pages/BillingSketchPage";
import PremiumPlanPage from "./pages/PremiumPlanPage";
import InstructorPage from "./pages/instructorPage";
import CreateLessonPage from "./pages/CreateLessonPage";
import AdminPage from "./pages/AdminPage.jsx";
import EarningsPage from "./pages/EarningsPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import QuizQuestionsPage from "./pages/QuizQuestionsPage.jsx";
import MyLessonsPage from "./pages/MyLessonsPage.jsx";
import EditLessonPage from "./pages/EditLessonPage.jsx";  
import PaymentSuccess from "./pages/PaymentSuccessPage.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const storedId = localStorage.getItem("userId");
  const userId = storedId ? Number(storedId) : null;
  console.log("✅ userId:", localStorage.getItem("userId"));
  console.log("✅ userId (Number):", Number(localStorage.getItem("userId")));

  const token = localStorage.getItem("token");

  let currentUserId = null;
  let currentUserRole = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      currentUserId = payload.id || payload.userId || payload.sub || null;

      if (payload.roles && payload.roles.length > 0) {
        currentUserRole = payload.roles[0];
      }
    } catch (e) {
      console.error("JWT parse hatası:", e);
    }
  }



  return (


    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/gunluk" element={<GunlukPage />} />
          <Route path="/footer" element={<Foooter />} />
          <Route path="/start" element={<BloomlishStartScreen />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/billing" element={<BillingSketchPage />} />
          <Route path="/premium" element={<PremiumPlanPage />} />
          <Route path="/instructor" element={<InstructorPage />} />
          <Route path="/createlesson" element={<CreateLessonPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/quiz-questions" element={<QuizQuestionsPage />} />
          <Route path="/mylessons" element={<MyLessonsPage />} />
          <Route path="/editlesson/:id" element={<EditLessonPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
      {currentUserId && currentUserRole === "ROLE_STUDENT" && (
        <ChatWidget
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
        />
      )}

    </Router>

    

  );
}

export default App;
