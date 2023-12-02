import React from "react";
import { NavLink } from "react-router-dom";

const ButtonAnalyzeMore = () => {

  return (
    <div>
      <NavLink
        to="/"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-auto"
      >
        Analyze More
      </NavLink>
    </div>
  );
};

export default ButtonAnalyzeMore;
