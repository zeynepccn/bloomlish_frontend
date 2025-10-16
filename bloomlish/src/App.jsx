import React from "react";
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "./routers";

function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
