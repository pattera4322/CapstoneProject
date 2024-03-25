import React from "react";

const ProgressBar = ({ showProgress, progress, text }) => {
  return (
    <div
      className={`${showProgress
        ? "opacity-100 transition-opacity duration-1000"
        : "opacity-0 invisible"
        }`}
    >
      <div className="pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-[#0068D2] text-white">
              {text}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-black">
              {progress}%
            </span>
          </div>
        </div>
        <div className="flex mb-2 items-center justify-center">
          {/* <div className="w-full overflow-hidden h-8 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${progress}%`,  transition:'width 1s linear', }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#0068D2]"
            >
            </div>
            <img
              src={process.env.PUBLIC_URL + "/assets/cat3.gif"}
              className="h-8"
              alt="resetIcon"
            />
          </div> */}
          <div className="w-full overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
            <div
              style={{ width: `${progress}%`, transition: 'width 1s linear', }}
              className="animate-pulse rounded-full bg-gradient-to-r from-green-500 to-blue-500"
            >
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
