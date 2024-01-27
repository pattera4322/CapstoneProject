import React, { useState } from 'react';

const DropdownMenu = ({ children }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="bg-transparent border-none focus:outline-none flex items-center"
      >
        <span>{children}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-40 bg-white border rounded-md shadow-md">
          {/* Content of the dropdown */}
          {children && (
            <div className="p-4">
              {children}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
