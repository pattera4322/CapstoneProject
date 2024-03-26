import "./App.css";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.js";

import HomePage from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import AboutUs from "./pages/AboutUs.js";
import History from "./pages/History.js";

function App() {
  return (
    <div className="text-center">
      <NavBar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Aboutus" element={<AboutUs />} />
        <Route path="/History" element={<History />} />
      </Routes>
    </div>
  );
}

export default App;
