import React from "react";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routers";
import ChatWidget from "./component/ChatWidget";

function App() {
  return (
    <Router>
      <AppRouter />
      <ChatWidget />
    </Router>
  );
}

export default App;
