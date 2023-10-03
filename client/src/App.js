import React, { useEffect, useState } from "react";
import "./App.css";
import "./index.css";
import { Routes, Route, NavLink } from "react-router-dom";
// import { NavbarDefault } from "./NavBar.js";

import HomePage from "./pages/Home.js";
import SelectColumn from "./pages/SelectColumn.js";
import Dashboard from "./pages/Dashboard.js";

function App() {
  // const [backendData, setBackendData] = useState([{}]);

  // useEffect(() => {
  //   fetch("/users")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setBackendData(data);
  //     });
  // }, []);

  return (
    <div class="text-center">
      <nav class="bg-white border-gray-200 bg-white">
        <div class="flex flex-wrap items-center justify-between px-8 pt-4">
          <NavLink to="/" class="flex items-center" aria-current="page">
            <img
              src="assets/SmartStockLogo.svg"
              class="h-12 mr-4"
              alt="Smart Stock"
            />
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Smart Stock
            </span>
            
          </NavLink>
          <div class="md:w-auto">
            <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
              <li>
                <NavLink to="/" class="" aria-current="page">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/SelectColumn"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Select Columns
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Dashboard"
                  class="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Dashboard
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
      </Routes>
    </div>
  );
}

export default App;
