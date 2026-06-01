import React, { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ResumeAnalyseContext = createContext();

// eslint-disable-next-line react/prop-types
export const ResumeAnalyseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [resumeReport, setResumeReport] = useState(null);

  return (
    <ResumeAnalyseContext.Provider
      value={{
        loading,
        setLoading,
        resumeReport,
        setResumeReport,
      }}
    >
      {children}
    </ResumeAnalyseContext.Provider>
  );
};
