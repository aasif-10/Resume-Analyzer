import React, { useEffect } from "react";
import "../style/analyse.scss";
import { useResumeAnalyse } from "../hooks/useResumeAnalyse";
import { useParams, useNavigate } from "react-router-dom";
import {
  getResumeById,
  getResumeReports,
} from "../services/resume-analyse-api";

const Analyse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    resumeReport,
    setResumeReport,
    loading,
    setLoading,
    resumeReports,
    setResumeReports,
    getPdfUrl,
    generatingPdf,
  } = useResumeAnalyse();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const response = await getResumeById(id);
      const reports = await getResumeReports();
      setResumeReport(response.resumeReport);
      setResumeReports(reports.resumeReports);
      setLoading(false);
    };
    fetch();
  }, [id, setResumeReport, setLoading, setResumeReports]);

  if (loading || !resumeReport) {
    return (
      <div className="analysis-page loading">
        <div className="analysis-header">
          <h1>Analysis Results</h1>
          <p>Loading analysis…</p>
        </div>
        <div className="loading-grid">
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      </div>
    );
  }

  if (generatingPdf) {
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

  const getScoreClass = (score) => {
    if (score >= 75) return "report-score score-high";
    if (score >= 50) return "report-score score-mid";
    return "report-score score-low";
  };

  const handleOptimize = async () => {
    try {
      await getPdfUrl(id);
      navigate(`/resume-preview/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="analysis-page">
      {/* ── Recent Reports Sidebar ── */}
      <div className="reports-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">Recent Reports</span>
        </div>

        <div className="sidebar-list">
          {!resumeReports || resumeReports.length === 0 ? (
            <div className="sidebar-empty">
              <span>No reports yet</span>
            </div>
          ) : (
            resumeReports.map((report) => (
              <button
                key={report._id}
                className={`sidebar-report-item ${report._id === id ? "sidebar-item-active" : ""}`}
                onClick={() => navigate(`/resume-analyse/${report._id}`)}
              >
                <div className="sidebar-item-top">
                  <span className={getScoreClass(report.matchScore)}>
                    {report.matchScore ?? "—"}%
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
      </div>
      {/* ── Main Content ── */}
      <div className="analysis-main">
        <div className="analysis-header">
          <h1>Analysis Results</h1>
          <p>Resume Analysis Report</p>
        </div>

        <div className="analysis-grid">
          {/* Row 1 / Top Section */}
          <div className="analysis-card ats-card">
            <h2>ATS Match</h2>
            <div
              className="ats-circle-container"
              style={{ "--score": `${resumeReport.matchScore}%` }}
            >
              <div className="ats-circle-inner">
                <div className="score">
                  {resumeReport.matchScore}
                  <span>%</span>
                </div>
              </div>
            </div>
            <p className="status-text">{resumeReport.matchStatus}</p>
          </div>

          <div className="analysis-card skills-card">
            <h2>Skill Alignment</h2>
            <div className="skills-container">
              <div className="skills-box matched-box">
                <h3>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="18"
                    height="18"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Matched Skills
                </h3>
                <div className="tags">
                  {resumeReport.skillGap.matchedSkills?.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="skills-box missing-box">
                <h3>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    width="18"
                    height="18"
                  >
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Missing Skills
                </h3>
                <div className="tags">
                  {resumeReport.skillGap.missingSkills?.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 / Middle Section */}
          <div className="analysis-card qualifications-card">
            <h2>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="20"
                height="20"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              Qualifications Required
            </h2>
            <ul className="qualifications-list">
              {resumeReport.qualification.missingQualification?.map((q, i) => {
                const name = typeof q === 'string' ? q : q.name;
                const level = typeof q === 'string' ? null : q.level;
                return (
                  <li key={i}>
                    <span className="icon-cross">✗</span>
                    <span>
                      {name}{" "}
                      {level && <span className="level">{level}</span>}
                    </span>
                  </li>
                );
              })}
              {resumeReport.qualification.matchedQualification?.map((q, i) => {
                const name = typeof q === 'string' ? q : q.name;
                return (
                  <li key={i}>
                    <span className="icon-check">✓</span>
                    <span style={{ color: "#9ca3af" }}>{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="analysis-card projects-card">
            <h2>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="20"
                height="20"
              >
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Project Recommendations
            </h2>
            <div className="projects-list">
              {resumeReport.projectRecommendation.recommendedProjects?.map(
                (p, i) => {
                  const title = typeof p === 'string' ? p : p.title;
                  const why = typeof p === 'string' ? null : p.why;
                  return (
                    <div key={i} className="project-item">
                      <h4>{title}</h4>
                      {why && <p>{why}</p>}
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Row 3 / Bottom Section */}
          <div className="analysis-card structural-card">
            <h2>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="20"
                height="20"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Missing Resume Sections
            </h2>
            <div className="improvements-grid">
              {resumeReport.resumeQualityRecommendation?.missing?.map(
                (missingItem, i) => (
                  <div key={i} className="improvement-item missing-box">
                    <h4>
                      <span className="imp-icon">⚠️</span>
                      {missingItem.title || "Missing Element"}
                    </h4>
                    <p>{missingItem.explanation || missingItem}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="analysis-card structural-card">
            <h2>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="20"
                height="20"
              >
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Structural Improvements
            </h2>
            <div className="improvements-grid">
              {resumeReport.resumeQualityRecommendation?.improvement?.map(
                (imp, i) => (
                  <div key={i} className="improvement-item">
                    <h4>
                      <span className="imp-icon">💡</span>
                      {imp.title || "Improvement"}
                    </h4>
                    <p>{imp.explanation || imp}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="analysis-actions">
          <button onClick={handleOptimize} className="btn-primary">
            Optimize Resume Now
          </button>
        </div>
      </div>{" "}
      {/* /analysis-main */}
    </div>
  );
};

export default Analyse;
