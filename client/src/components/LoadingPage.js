import React from "react";
import HashLoader from "react-spinners/HashLoader";

const LoadingPage = ({ loading }) => {
  return (
    <>
      {loading && (
        <div className="loader fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white opacity-75 z-50">
          <HashLoader 
            color="#0035a0"
            cssOverride={{}}
            size={75}
            speedMultiplier={1.5}
          />
        </div>
      )}
    </>
  );
};

export default LoadingPage;
