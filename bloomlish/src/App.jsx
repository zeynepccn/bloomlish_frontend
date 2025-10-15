import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from "react";
import BlogTab from "./components/BlogTab";

function App() {
  return (
    <div className="min-h-screen bg-pink-50">
      <h1 className="text-3xl text-center font-bold text-pink-600 pt-6">
        GÜNLÜK YAZILAR
      </h1>
      <div className="flex justify-center mt-4">
        <button className="bg-pink-400 text-white px-6 py-2 rounded-lg mx-2">
          BLOG
        </button>
        <button className="border border-pink-400 px-6 py-2 rounded-lg mx-2">
          GÜNLÜĞÜM
        </button>
      </div>
      <BlogTab />
    </div>
  );
}

export default App;