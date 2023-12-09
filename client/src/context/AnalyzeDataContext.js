import { createContext, useContext, useState } from 'react';

const AnalyzeDataContext = createContext();

export const AnalyzeDataProvider = ({ children }) => {
  const [contextAnalyzeData, setData] = useState([]);

  const setContextAnalyzeData = (newData) => {
    setData(newData);
  };

  return (
    <AnalyzeDataContext.Provider value={{ contextAnalyzeData, setContextAnalyzeData }}>
      {children}
    </AnalyzeDataContext.Provider>
  );
};

export const useDataContext = () => useContext(AnalyzeDataContext);
