import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/analyse.scss";
import "../style/preview.scss";
import { useResumeAnalyse } from "../hooks/useResumeAnalyse";

// ─── Icons ────────────────────────────────────────────────────────────────

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────

const Preview = () => {
  const navigate = useNavigate();
  const { pdfUrl, getPdfUrl } = useResumeAnalyse();
  const { id } = useParams();

  useEffect(() => {
    if (!pdfUrl) {
      getPdfUrl(id);
    }
  }, [id, pdfUrl, getPdfUrl]);

  // ── Loading / Generating ─────────────────────────────────────────────
  if (!pdfUrl) {
    return (
      <div className="analysis-page generating-pdf-screen">
        <div className="generating-card">
          <div className="spinner-container">
            <div className="spinner" />
          </div>
          <h2>Optimizing Resume</h2>
          <p>Applying AI recommendations and formatting your new PDF...</p>
        </div>
      </div>
    );
  }

  // ── Preview ──────────────────────────────────────────────────────────
  return (
    <div className="analysis-page preview-page">

      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <header className="preview-header">
        <div className="preview-header-text">
          <p className="preview-eyebrow">Resume Preview</p>
          <h1 className="preview-title">Optimized Resume</h1>
        </div>

        <div className="preview-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <IconArrowLeft />
            <span>Back to Analysis</span>
          </button>

          <a
            href={pdfUrl}
            download="optimized-resume.pdf"
            className="btn-download"
          >
            <IconDownload />
            Download PDF
          </a>
        </div>
      </header>

      {/* ── PDF Iframe ──────────────────────────────────────────────── */}
      <div className="preview-content">
        <iframe
          src={pdfUrl}
          title="Optimized Resume PDF"
        />
      </div>

    </div>
  );
};

export default Preview;
