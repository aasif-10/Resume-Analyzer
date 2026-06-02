import React, { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ResumeAnalyseContext = createContext();

// eslint-disable-next-line react/prop-types
export const ResumeAnalyseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [resumeReport, setResumeReport] = useState(null);
  const [resumeReports, setResumeReports] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  return (
    <ResumeAnalyseContext.Provider
      value={{
        loading,
        setLoading,
        resumeReport,
        setResumeReport,
        resumeReports,
        setResumeReports,
        pdfUrl,
        setPdfUrl,
        generatingPdf,
        setGeneratingPdf
      }}
    >
      {children}
    </ResumeAnalyseContext.Provider>
  );
};
