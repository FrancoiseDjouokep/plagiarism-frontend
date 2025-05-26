// Create a context file (e.g., AnalysisContext.js)
import { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [analysisState, setAnalysisState] = useState({
    file: null,
    title: '',
    results: [],
    overallSimilarity: 0,
    message: ''
  });

  return (
    <AnalysisContext.Provider value={{ analysisState, setAnalysisState }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);