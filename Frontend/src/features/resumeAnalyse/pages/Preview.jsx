import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/analyse.scss";
import "../style/preview.scss";
import { useResumeAnalyse } from "../hooks/useResumeAnalyse";

const Preview = () => {
  const navigate = useNavigate();
  const { pdfUrl, getPdfUrl } = useResumeAnalyse();
  const { id } = useParams();

  useEffect(() => {

    if (!pdfUrl) {
      getPdfUrl(id);
    }
  }, [id, pdfUrl, getPdfUrl]);

  if (!pdfUrl) {
    return (
      <div className="analysis-page generating-pdf-screen">
        <div className="generating-card">
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
          <h2>Optimizing Resume</h2>
          <p>Applying AI recommendations and formatting your new PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-page preview-page">
      <div className="analysis-header preview-header">
        <div className="header-text">
          <h1>Optimized Resume Preview</h1>
          <p>Review your optimized resume before downloading</p>
        </div>
        <div className="analysis-actions preview-actions">
          <a href={pdfUrl} download="optimized-resume.pdf" className="btn-secondary btn-download">
            Download
          </a>
          <button onClick={() => navigate(-1)} className="btn-primary">
            Back to Analysis
          </button>
        </div>
      </div>

      <div className="preview-content">
        <iframe
          src={pdfUrl}
          title="Resume PDF"
        />
      </div>
    </div>
  );
};

export default Preview;
