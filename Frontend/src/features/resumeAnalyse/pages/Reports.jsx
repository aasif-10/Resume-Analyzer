import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResumeReports } from "../services/resume-analyse-api";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/reports.scss";

// ─── Icons ────────────────────────────────────────────────────────────────

const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" fill="none" stroke="white" strokeWidth="1.5" />
  </svg>
);

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconEmpty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="12" y2="17" />
  </svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Helpers ─────────────────────────────────────────────────────────────

const getScoreClass = (score) => {
  if (score >= 75) return "high";
  if (score >= 50) return "mid";
  return "low";
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// ─── Sub-components ───────────────────────────────────────────────────────

const ReportCard = ({ report, onClick }) => {
  const tier = getScoreClass(report.matchScore ?? 0);
  const matchedSkills = report.skillGap?.matchedSkills?.length ?? 0;
  const missingSkills = report.skillGap?.missingSkills?.length ?? 0;
  const missingQual   = report.qualification?.missingQualification?.length ?? 0;

  return (
    <button
      className={`rp-card score-card-${tier}`}
      onClick={() => onClick(report._id)}
      aria-label={`View report for ${report.jobTitle ?? "Unknown Role"}`}
    >
      {/* ── Header ─────────────────────────────────── */}
      <div className="rp-card-header">
        <div className="rp-card-header-left">
          <span className="rp-card-job-title">
            {report.jobTitle ?? "Unknown Role"}
          </span>
          <span className="rp-card-date">{formatDate(report.createdAt)}</span>
        </div>

        <div className={`rp-score-badge score-${tier}`}>
          <span className="rp-score-num">{report.matchScore ?? 0}</span>
          <span className="rp-score-pct">% match</span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────── */}
      <div className="rp-card-body">
        {/* Progress bar */}
        <div className="rp-progress-row">
          <div className="rp-progress-label-row">
            <span className="rp-progress-label">Match Score</span>
            {report.matchStatus && (
              <span className="rp-progress-status">{report.matchStatus}</span>
            )}
          </div>
          <div className="rp-progress-track">
            <div
              className={`rp-progress-fill fill-${tier}`}
              style={{ width: `${report.matchScore ?? 0}%` }}
            />
          </div>
        </div>

        {/* Mini stats */}
        <div className="rp-mini-stats">
          <div className="rp-mini-stat">
            <span className="rp-mini-val">{matchedSkills}</span>
            <span className="rp-mini-key">Matched</span>
          </div>
          <div className="rp-mini-stat">
            <span className="rp-mini-val">{missingSkills}</span>
            <span className="rp-mini-key">Gaps</span>
          </div>
          <div className="rp-mini-stat">
            <span className="rp-mini-val">{missingQual}</span>
            <span className="rp-mini-key">Missing Quals</span>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <div className="rp-card-footer">
        <span className="rp-card-cta">View full report</span>
        <span className="rp-card-arrow"><IconArrow /></span>
      </div>
    </button>
  );
};

const SkeletonGrid = () => (
  <div className="rp-skeleton-grid">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="rp-skeleton-card" />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────

const Reports = () => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getResumeReports();
        if (!cancelled) {
          setReports(data.resumeReports ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load reports. Please try again.");
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchReports();
    return () => { cancelled = true; };
  }, []);

  const handleCardClick = (id) => navigate(`/resume-analyse/${id}`);

  // ── Derived stats ───────────────────────────────────────────────────
  const avgScore = reports.length
    ? Math.round(reports.reduce((acc, r) => acc + (r.matchScore ?? 0), 0) / reports.length)
    : 0;

  const bestScore = reports.length
    ? Math.max(...reports.map((r) => r.matchScore ?? 0))
    : 0;

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className="reports-page">

      {/* ── Topbar ─────────────────────────────────────────────────── */}
      <header className="rp-topbar">
        <div className="rp-topbar-brand">
          <div className="rp-topbar-icon">
            <IconDoc />
          </div>
          <span className="rp-topbar-name">ResumeAI</span>
        </div>

        <div className="rp-topbar-actions">
          <button className="btn-secondary" onClick={() => navigate("/upload")}>
            New Analysis
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────── */}
      <main className="rp-main">

        {/* Page header */}
        <div className="rp-page-header">
          <p className="rp-eyebrow">Dashboard</p>
          <h1 className="rp-title">Your Reports</h1>
          <p className="rp-subtitle">
            All your resume analyses in one place. Click a card to view the full breakdown.
          </p>
        </div>

        {/* Stats strip — only when reports exist */}
        {!loading && !error && reports.length > 0 && (
          <div className="rp-stats-strip">
            <div className="rp-stat-pill">
              <span className="rp-stat-val">{reports.length}</span>
              <div className="rp-stat-divider" />
              <span className="rp-stat-key">Total Reports</span>
            </div>
            <div className="rp-stat-pill">
              <span className="rp-stat-val">{avgScore}%</span>
              <div className="rp-stat-divider" />
              <span className="rp-stat-key">Avg. Match Score</span>
            </div>
            <div className="rp-stat-pill">
              <span className="rp-stat-val">{bestScore}%</span>
              <div className="rp-stat-divider" />
              <span className="rp-stat-key">Best Score</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <SkeletonGrid />}

        {/* Error */}
        {!loading && error && (
          <div className="rp-error">
            <span style={{ display: "flex", width: 32, height: 32, color: "rgba(228,155,147,0.7)" }}><IconAlert /></span>
            <p className="rp-error-title">{error}</p>
            <p className="rp-error-sub">Check your connection or try refreshing the page.</p>
            <button
              className="btn-secondary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && reports.length === 0 && (
          <div className="rp-empty">
            <div className="rp-empty-icon">
              <IconEmpty />
            </div>
            <p className="rp-empty-title">No reports yet</p>
            <p className="rp-empty-sub">
              Upload your resume and a job description to generate your first AI match report.
            </p>
            <button className="btn-secondary" onClick={() => navigate("/upload")}>
              Upload Resume
            </button>
          </div>
        )}

        {/* Reports grid */}
        {!loading && !error && reports.length > 0 && (
          <div className="rp-grid">
            {reports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Reports;
