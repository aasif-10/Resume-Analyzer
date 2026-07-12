import React, { useEffect } from "react";
import "../style/analyse.scss";
import { useResumeAnalyse } from "../hooks/useResumeAnalyse";
import { useParams, useNavigate } from "react-router-dom";
import {
  getResumeById,
  getResumeReports,
} from "../services/resume-analyse-api";
import { useAuth } from "../../auth/hooks/useAuth";

// ─── Icons ────────────────────────────────────────────────────────────────

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconSkillCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconSkillMissing = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

const IconGrad = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const IconProject = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

const IconMissing = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconImprove = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────

const getScoreClass = (score) => {
  if (score >= 75) return "score-high";
  if (score >= 50) return "score-mid";
  return "score-low";
};

// ─── Component ───────────────────────────────────────────────────────────

const Analyse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const {
    resumeReport,
    setResumeReport,
    loading,
    setLoading,
    resumeReports,
    setResumeReports,
    getPdfUrl,
    generatingPdf,
    cancelGeneration,
  } = useResumeAnalyse();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await getResumeById(id);
        const reports  = await getResumeReports();
        setResumeReport(response.resumeReport);
        setResumeReports(reports.resumeReports);
      } catch (err) {
        console.error("Failed to load resume report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, setResumeReport, setLoading, setResumeReports]);

  // ── Loading ──────────────────────────────────────────────────────────
  if (loading || !resumeReport) {
    return (
      <div className="analysis-page loading">
        <div className="analysis-header">
          <h1>Analysis Results</h1>
          <p>Loading your report...</p>
        </div>
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="loading-card" />
          ))}
        </div>
      </div>
    );
  }

  // ── Generating PDF ───────────────────────────────────────────────────
  if (generatingPdf) {
    return (
      <div className="analysis-page generating-pdf-screen">
        <div className="generating-card">
          <div className="spinner-container">
            <div className="spinner" />
          </div>
          <h2>Optimizing Resume</h2>
          <p>Applying AI recommendations and formatting your new PDF...</p>
          <button 
            className="btn-secondary" 
            onClick={cancelGeneration} 
            style={{ marginTop: '20px' }}
          >
            Cancel Optimization
          </button>
        </div>
      </div>
    );
  }

  const handleOptimize = async () => {
    try {
      const url = await getPdfUrl(id);
      if (url) {
        navigate(`/resume-preview/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scoreClass   = getScoreClass(resumeReport.matchScore);
  const matchedSkills = resumeReport.skillGap?.matchedSkills ?? [];
  const missingSkills = resumeReport.skillGap?.missingSkills ?? [];
  const missingQual   = resumeReport.qualification?.missingQualification ?? [];
  const matchedQual   = resumeReport.qualification?.matchedQualification ?? [];
  const projects      = resumeReport.projectRecommendation?.recommendedProjects ?? [];
  const missingSecs   = resumeReport.resumeQualityRecommendation?.missing ?? [];
  const improvements  = resumeReport.resumeQualityRecommendation?.improvement ?? [];

  // ── Main ─────────────────────────────────────────────────────────────
  return (
    <div className="analysis-page">

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="reports-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">History</span>
        </div>
        <div className="sidebar-list">
          {!resumeReports || resumeReports.length === 0 ? (
            <div className="sidebar-empty">No reports yet</div>
          ) : (
            resumeReports.map((report) => (
              <button
                key={report._id}
                className={`sidebar-report-item ${report._id === id ? "sidebar-item-active" : ""}`}
                onClick={() => navigate(`/resume-analyse/${report._id}`)}
              >
                <div className="sidebar-item-top">
                  <span className={`report-score ${getScoreClass(report.matchScore)}`}>
                    {report.matchScore ?? 0}%
                  </span>
                  <span className="sidebar-item-date">
                    {new Date(report.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="sidebar-item-title">
                  {report.jobTitle ?? "Unknown Role"}
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="analysis-main">

        {/* Sticky topbar */}
        <div className="analysis-topbar">
          <div className="topbar-left">
            <span className="topbar-eyebrow">Analysis Report</span>
            <span className="topbar-title">
              {resumeReport.jobTitle || "Resume Analysis"}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button className="btn-secondary" onClick={() => navigate('/upload')}>
              Upload Resume
            </button>
            <button className="btn-optimize" onClick={handleOptimize}>
              Optimize Resume
              <IconArrow />
            </button>
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="analysis-content">

          {/* ── Score banner ─────────────────────────────────────── */}
          <div className="score-banner">
            <div className={`score-number-block ${scoreClass}`}>
              <span className="score-num">{resumeReport.matchScore}</span>
              <span className="score-pct">%</span>
            </div>

            <div className="score-divider" />

            <div className="score-meter-block">
              <div className="score-meter-row">
                <span className="score-label">Match Score</span>
                <span className={`score-status-text ${scoreClass}`}>
                  {resumeReport.matchStatus}
                </span>
              </div>
              <div className="score-track">
                <div
                  className={`score-fill ${scoreClass}`}
                  style={{ width: `${resumeReport.matchScore}%` }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="score-meta">
              <div className="meta-item">
                <span className="meta-val">{matchedSkills.length}</span>
                <span className="meta-key">Matched Skills</span>
              </div>
              <div className="meta-item">
                <span className="meta-val">{missingSkills.length}</span>
                <span className="meta-key">Skill Gaps</span>
              </div>
              <div className="meta-item">
                <span className="meta-val">{missingQual.length}</span>
                <span className="meta-key">Missing Quals</span>
              </div>
            </div>
          </div>

          {/* ── Row 1: Skills ─────────────────────────────────────── */}
          <div className="analysis-row row-2">

            {/* Matched skills */}
            <div className="a-card">
              <div className="a-card-header">
                <IconSkillCheck />
                <span className="a-card-title">Matched Skills</span>
                <span className="a-card-count">{matchedSkills.length}</span>
              </div>
              <div className="a-card-body">
                <div className="tags">
                  {matchedSkills.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--t3)" }}>
                      None found
                    </span>
                  ) : (
                    matchedSkills.map((s) => (
                      <span key={s} className="skill-tag tag-matched">{s}</span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Missing skills */}
            <div className="a-card">
              <div className="a-card-header">
                <IconSkillMissing />
                <span className="a-card-title">Missing Skills</span>
                <span className="a-card-count">{missingSkills.length}</span>
              </div>
              <div className="a-card-body">
                <div className="tags">
                  {missingSkills.length === 0 ? (
                    <span style={{ fontSize: "0.8rem", color: "var(--t3)" }}>
                      No gaps found
                    </span>
                  ) : (
                    missingSkills.map((s) => (
                      <span key={s} className="skill-tag tag-missing">{s}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 2: Qualifications + Projects ──────────────────── */}
          <div className="analysis-row row-2">

            {/* Qualifications */}
            <div className="a-card">
              <div className="a-card-header">
                <IconGrad />
                <span className="a-card-title">Qualifications</span>
              </div>
              <div className="a-card-body">
                <ul className="qual-list">
                  {missingQual.map((q, i) => {
                    const name  = typeof q === "string" ? q : q.name;
                    const level = typeof q === "string" ? null : q.level;
                    return (
                      <li key={i} className="qual-item">
                        <span className="qual-icon icon-cross">✕</span>
                        <span>
                          {name}
                          {level && <span className="qual-level">{level}</span>}
                        </span>
                      </li>
                    );
                  })}
                  {matchedQual.map((q, i) => {
                    const name = typeof q === "string" ? q : q.name;
                    return (
                      <li key={`m-${i}`} className="qual-item">
                        <span className="qual-icon icon-check">✓</span>
                        <span style={{ color: "var(--text-secondary)" }}>{name}</span>
                      </li>
                    );
                  })}
                  {missingQual.length === 0 && matchedQual.length === 0 && (
                    <li style={{ fontSize: "0.8rem", color: "var(--t3)", padding: "8px 0" }}>
                      No qualification data
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Project recommendations */}
            <div className="a-card">
              <div className="a-card-header">
                <IconProject />
                <span className="a-card-title">Project Recommendations</span>
                <span className="a-card-count">{projects.length}</span>
              </div>
              <div className="a-card-body">
                <div className="project-list">
                  {projects.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      No recommendations
                    </p>
                  ) : (
                    projects.map((p, i) => {
                      const title = typeof p === "string" ? p : p.title;
                      const why   = typeof p === "string" ? null : p.why;
                      return (
                        <div key={i} className="project-item" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span className="imp-dot dot-info" style={{ marginTop: '7px', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4>{title}</h4>
                            {why && <p>{why}</p>}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 3: Improvements ───────────────────────────────── */}
          <div className="analysis-row row-2">

            {/* Missing sections */}
            <div className="a-card">
              <div className="a-card-header">
                <IconMissing />
                <span className="a-card-title">Missing Sections</span>
                <span className="a-card-count">{missingSecs.length}</span>
              </div>
              <div className="a-card-body">
                <div className="imp-list">
                  {missingSecs.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "var(--t3)" }}>Nothing missing</p>
                  ) : (
                    missingSecs.map((item, i) => (
                      <div key={i} className="imp-item imp-missing" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span className="imp-dot dot-warn" style={{ marginTop: '7px' }} />
                        <p style={{ margin: 0 }}>{item.explanation || item}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Structural improvements */}
            <div className="a-card">
              <div className="a-card-header">
                <IconImprove />
                <span className="a-card-title">Improvements</span>
                <span className="a-card-count">{improvements.length}</span>
              </div>
              <div className="a-card-body">
                <div className="imp-list">
                  {improvements.length === 0 ? (
                    <p style={{ fontSize: "0.8rem", color: "var(--t3)" }}>No improvements needed</p>
                  ) : (
                    improvements.map((imp, i) => (
                      <div key={i} className="imp-item imp-improve" style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span className="imp-dot dot-info" style={{ marginTop: '7px' }} />
                        <p style={{ margin: 0 }}>{imp.explanation || imp}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Analyse;
