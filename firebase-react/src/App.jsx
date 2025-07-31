// src/App.jsx
import React from "react";
import Dashboard from "./components/Dashboard";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <div className="dark min-h-screen bg-[#121212] text-white">
      <Dashboard />
    </div>
  );
}

export default App;
