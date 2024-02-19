import React, { createContext, useState, useContext } from "react";

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progressData, setProgressData] = useState(JSON.parse(localStorage.getItem("progress"))||{fileid:0,progress:0});

  return (
    <ProgressContext.Provider value={{ progressData, setProgressData }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
