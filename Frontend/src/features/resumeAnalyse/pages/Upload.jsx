import React, { useRef, useState } from "react";
import "../style/style.scss";
import { useResumeAnalyse } from "../hooks/useResumeAnalyse";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

// ─── Icons ────────────────────────────────────────────────────────────────

const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconInfo = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────

const Upload = () => {
  const navigate = useNavigate();
  const { loading, generateResume, cancelGeneration } = useResumeAnalyse();
  const { handleLogout } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const resumeInputRef = useRef(null);

  const hasJD = jobDescription.trim().length > 0;
  const hasFile = Boolean(fileName);
  const canSubmit = hasJD && hasFile;

  const hintText = !hasJD && !hasFile
    ? "Paste a job description and upload a PDF to continue"
    : !hasJD
      ? "Paste a job description to continue"
      : !hasFile
        ? "Upload your resume PDF to continue"
        : "Ready to analyze";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleGenerateReport = async () => {
    if (!canSubmit) return;
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateResume({
      jobDescription,
      selfDescription: "",
      resumeFile,
    });
    if (data && data._id) {
      navigate(`/resume-analyse/${data._id}`);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="upload-loading">
        <div className="loading-spinner" />
        <div>
          <h2>Analyzing your Resume</h2>
          <p>Our AI is reviewing your documents. This takes just a moment.</p>
        </div>
        <button
          className="btn-secondary"
          onClick={(e) => { e.preventDefault(); cancelGeneration(); }}
          style={{ marginTop: '20px' }}
        >
          Cancel Analysis
        </button>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────
  return (
    <div className="upload-page">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="upload-topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-icon">
            <IconDoc />
          </div>
          <span className="topbar-logo-name">ResumeLift</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>
            Reports
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="upload-main">

        {/* Header row */}
        <div className="upload-header">
          <div className="upload-header-text">
            <p className="upload-eyebrow">Resume Analysis</p>
            <h1 className="upload-title">Upload your resume</h1>
            <p className="upload-subtitle">
              Both fields are required to generate your AI match report.
            </p>
          </div>


        </div>

        {/* Two input cards */}
        <div className="upload-cols">

          {/* Card 1 — Job Description */}
          <div className={`upload-card ${hasJD ? "card-filled" : ""}`}>
            <div className="upload-card-header">
              <label className="upload-card-title" htmlFor="jd-textarea">
                Job Description
              </label>
            </div>
            <div className="upload-card-body">
              <textarea
                id="jd-textarea"
                className="jd-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job posting here — responsibilities, requirements, qualifications..."
              />
            </div>
          </div>

          {/* Card 2 — Resume PDF */}
          <div className={`upload-card ${hasFile ? "card-filled" : ""}`}>
            <div className="upload-card-header">
              <span className="upload-card-title">Resume PDF</span>
            </div>
            <div className="upload-card-body">
              <input
                ref={resumeInputRef}
                type="file"
                id="resume-upload"
                className="file-hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload"
                className={`upload-zone ${hasFile ? "zone-filled" : ""}`}
              >
                <div className="upload-zone-icon">
                  {hasFile ? <IconCheck /> : <IconUpload />}
                </div>

                <div>
                  <p className="upload-zone-primary">
                    {hasFile ? fileName : "Drop your PDF here"}
                  </p>
                  <p className="upload-zone-secondary">
                    {hasFile
                      ? "Click to replace"
                      : "or click to browse"}
                  </p>
                </div>

                {!hasFile && (
                  <span className="upload-zone-badge">
                    PDF only
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* CTA bar */}
        <div className="upload-cta-bar">
          <p className={`upload-hint ${canSubmit ? "hint-ready" : ""}`}>
            <IconInfo />
            {hintText}
          </p>

          <button
            className="btn-analyze"
            onClick={handleGenerateReport}
            disabled={!canSubmit}
          >
            <div className="btn-analyze-text">
              <span>Analyze Now</span>
              <span>Get your match report</span>
            </div>
            <div className="btn-arrow">
              <IconArrow />
            </div>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Upload;
