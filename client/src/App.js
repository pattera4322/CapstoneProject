import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";

import HomePage from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import AboutUs from "./pages/AboutUs.js";

function App() {
  return (
    <div className="text-center font-amiko">
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Aboutus" element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default App;
