import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

const Dropdown = ({ isDivider = false, handleSignout, userName }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        id="dropdownDividerButton"
        data-dropdown-toggle="dropdownDivider"
        className="rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
        type="button"
        onClick={handleDropdownToggle}
      >
        {userName}
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform transform ${
            isDropdownVisible ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu*/}
      {isDropdownVisible && (
        <div className="z-10 bg-white divide-y divide-gray-100 rounded-b-lg w-44 dark:bg-gray-700 dark:divide-gray-600 absolute mt-2">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <NavLink to="/History">
              <li className="block px-4 py-2 hover:bg-gray-200 dark:hover:text-white">
                History
              </li>
            </NavLink>
            <NavLink to="/Aboutus">
              <li className="block px-4 py-2 hover:bg-gray-200 dark:hover:text-white">
                About us
              </li>
            </NavLink>
          </ul>
          {isDivider && (
            <div className="py-2">
              <li
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-300 hover:text-white"
                onClick={handleSignout}
              >
                Log out
              </li>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
