import React, { createContext, useState, useContext } from "react";

const ProgressContext = createContext();
const user = JSON.parse(localStorage.getItem("user"));

export const ProgressProvider = ({ children }) => {
  const [progressData, setProgressData] = useState(
    JSON.parse(localStorage.getItem("progress")) || { userid:user? user.uid : "",fileid: 0, progress: 0 }
  );

  return (
    <ProgressContext.Provider value={{ progressData, setProgressData }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);
