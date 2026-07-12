import { useContext, useRef } from "react";
import {
  generateResumeReport,
  getResumePdf,
} from "../services/resume-analyse-api";
import { ResumeAnalyseContext } from "../resume-analyse-context";
import axios from "axios";

export const useResumeAnalyse = () => {

  const abortControllerRef = useRef(null);
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

    abortControllerRef.current = new AbortController()
    let response = null;
    try {
      response = await generateResumeReport({
        jobDescription,
        selfDescription,
        resumeFile,
        signal: abortControllerRef.current.signal
      });
      setResumeReport(response.resumeReport);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request cancelled")
      } else {
        console.log(err);
        throw err;
      }
    } finally {
      setLoading(false);
    }

    return response?.resumeReport;
  };

  const generateResumePdf = async (id) => {
    try {
      setGeneratingPdf(true);
      abortControllerRef.current = new AbortController();
      const response = await getResumePdf(id, abortControllerRef.current.signal);
      return response;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("PDF generation cancelled");
        return null;
      }
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
      abortControllerRef.current = new AbortController();
      const url = await getResumePdf(id, abortControllerRef.current.signal);
      setPdfUrl(url);
      return url;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("PDF generation cancelled");
      } else {
        console.log(err);
      }
      return null;
    } finally {
      setGeneratingPdf(false);
    }
  };

  const cancelGeneration = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

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
    getPdfUrl,
    cancelGeneration
  };
};
