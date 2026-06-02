import { useContext } from "react";
import {
  generateResumeReport,
  getResumePdf,
} from "../services/resume-analyse-api";
import { ResumeAnalyseContext } from "../resume-analyse-context";

export const useResumeAnalyse = () => {
  const context = useContext(ResumeAnalyseContext);

  const {
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
  } = context;

  const generateResume = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    try {
      response = await generateResumeReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setResumeReport(response.resumeReport);
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }

    return response.resumeReport;
  };

  const generateResumePdf = async (id) => {
    try {
      setGeneratingPdf(true);
      const response = await getResumePdf(id);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setGeneratingPdf(false);
    }
  };

  const getPdfUrl = async (id) => {
    try {
      setGeneratingPdf(true);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const url = await getResumePdf(id);
      setPdfUrl(url);
    } catch (err) {
      console.log(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  return {
    loading,
    setLoading,
    resumeReport,
    setResumeReport,
    resumeReports,
    setResumeReports,
    pdfUrl,
    setPdfUrl,
    generatingPdf,
    setGeneratingPdf,
    generateResume,
    generateResumePdf,
    getPdfUrl
  };
};
