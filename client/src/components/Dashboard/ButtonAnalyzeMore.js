import React from "react";

const ButtonAnalyzeMore = () => {
  const handleAnalyzeMoreClick = () => {
    // Redirect to the home page
    window.location.href = "/";
  };

  return (
    <div>
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center ml-auto"
        onClick={handleAnalyzeMoreClick}
      >
        Analyze More
      </button>
    </div>
  );
};

export default ButtonAnalyzeMore;
