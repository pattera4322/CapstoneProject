// import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import { Routes, Route, NavLink } from "react-router-dom";
// import { NavbarDefault } from "./NavBar.js";

import HomePage from "./pages/Home.js";
import SelectColumn from "./pages/SelectColumn.js";
import Dashboard from "./pages/Dashboard.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";

function App() {

  return (
    <div className="text-center font-amiko">
  <nav className="fixed top-0 z-40 w-full bg-white border-gray-200 drop-shadow-lg">
    <div className="flex flex-wrap items-center justify-between px-4 sm:px-8 py-1">
      <NavLink to="/" className="flex items-center" aria-current="page">
        <img
          src="/sj1/assets/SmartStockLogo.svg"
          className="h-12 mr-2 sm:mr-4"
          alt="Smart Stock"
        />
        <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
          Smart Stock
        </span>
      </NavLink>
      <div className="md:hidden">
      </div>
      <div className="hidden md:flex md:w-auto">
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white">
          <li>
            <NavLink
              to="/Login"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Register"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/SelectColumn" element={<SelectColumn />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
