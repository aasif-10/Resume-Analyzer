import { useContext } from "react";
import { generateResumeReport } from "../services/resume-analyse-api";
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

  return {
    loading,
    setLoading,
    resumeReport,
    setResumeReport,
    resumeReports,
    setResumeReports,
    generateResume,
  };
};
