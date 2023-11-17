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
    <div class="text-center font-amiko">
  <nav class="fixed top-0 z-40 w-full bg-white border-gray-200 bg-white drop-shadow-lg">
    <div class="flex flex-wrap items-center justify-between px-4 sm:px-8 py-1">
      <NavLink to="/" class="flex items-center" aria-current="page">
        <img
          src="assets/SmartStockLogo.svg"
          class="h-12 mr-2 sm:mr-4"
          alt="Smart Stock"
        />
        <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">
          Smart Stock
        </span>
      </NavLink>
      <div class="md:hidden">
       
        <button id="menuToggle" class="text-gray-600 focus:outline-none">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      <div class="hidden md:flex md:w-auto">
        <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white">
          <li>
            <NavLink
              to="/Login"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Register"
              class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
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
