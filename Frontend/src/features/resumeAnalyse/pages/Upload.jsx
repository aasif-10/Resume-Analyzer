import React, { useRef, useState } from "react";
import "../style/style.scss";
import { useResumeAnalyse } from "../hooks/useResumeAnalyse";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();

  const { loading, generateResume } = useResumeAnalyse();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const resumeInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateResume({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    navigate(`/resume-analyse/${data._id}`);
  };

  if (loading) {
    return (
      <div className="upload-page">
        <div
          className="upload-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <div
            className="loading-state"
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <svg
              style={{
                width: "64px",
                height: "64px",
                animation: "spin 1s linear infinite",
                color: "var(--purple)",
                marginBottom: "20px",
              }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                style={{ opacity: 0.25 }}
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Analyzing your Resume...
            </h2>
            <p style={{ color: "var(--gray)", fontSize: "1.1rem" }}>
              Please wait while our AI models parse your documents.
            </p>
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        {/* Left Panel - Info Section with Job Description */}
        <div className="upload-left">
          <div className="left-content">
            {/* Job Description Card */}
            <div className="input-card card-accent-orange">
              <div className="card-header">
                <span className="card-number">01</span>
                <label className="card-label">Job Description</label>
              </div>
              <div className="card-body">
                <textarea
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                  }}
                  className="input-textarea auto-scroll"
                  placeholder="Paste the job posting you're targeting..."
                  rows="20"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="upload-right">
          <div className="form-wrapper">
            <h2 className="form-title">Upload Resume</h2>
            <p className="form-subtitle">
              Upload or paste your resume to begin
            </p>

            {/* Form */}
            <div className="upload-form">
              {/* Resume Upload Card */}
              <div className="input-card card-accent-purple">
                <div className="card-header">
                  <span className="card-number">02</span>
                  <label className="card-label">Your Resume</label>
                </div>
                <div className="card-body">
                  <input
                    ref={resumeInputRef}
                    type="file"
                    id="resume-upload"
                    className="file-hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="resume-upload" className="upload-zone">
                    <div className="upload-icon-box">
                      <svg
                        className="upload-svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                    </div>
                    <div className="upload-text">
                      <span className="upload-primary">{fileName ? fileName : "Drop file or click"}</span>
                      <span className="upload-secondary">{fileName ? "File selected" : "PDF, DOC, DOCX"}</span>
                    </div>
                  </label>
                  <div className="or-divider">
                    <span>OR</span>
                  </div>
                  <textarea
                    value={selfDescription}
                    onChange={(e) => {
                      setSelfDescription(e.target.value);
                    }}
                    className="input-textarea compact auto-scroll"
                    placeholder="Paste self description..."
                    rows="4"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button onClick={handleGenerateReport} className="btn-submit">
                <span className="btn-content">
                  <span className="btn-text">Analyze Now</span>
                  <span className="btn-sub">Get insights in seconds</span>
                </span>
                <div className="btn-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
