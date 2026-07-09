import React from "react";
import "../style/auth-style.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

// ─── Inline SVG icons (no extra deps) ────────────────────────────────────

const IconMail = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" stroke="none" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="white" strokeWidth="1.5" fill="none" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="white" strokeWidth="1.5" fill="none" />
    <polyline points="10 9 9 9 8 9" stroke="white" strokeWidth="1.5" fill="none" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────

const Login = () => {
  const { loading, handleLogin, error, setError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleLogin(email, password);
      navigate("/upload");
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className="auth-container">
      {/* ── Left branding panel ─────────────────────────────────────── */}
      <aside className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <IconDoc />
            </div>
            <span className="auth-logo-name">ResumeLift</span>
          </div>

          <h2 className="auth-panel-headline">
            Your resume,<br />
            <em>perfectly tailored.</em>
          </h2>
          <p className="auth-panel-sub">
            Upload your resume and get an AI-powered analysis with targeted
            suggestions in seconds.
          </p>
        </div>


      </aside>

      {/* ── Right form panel ────────────────────────────────────────── */}
      <main className="auth-panel-right">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">Welcome back</p>
            <h1 className="auth-title">Sign in to your account</h1>
            <p className="auth-subtitle">
              Continue where you left off.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <div className="form-input-wrap">
                <span className="form-input-icon">
                  <IconMail />
                </span>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="form-input-wrap">
                <span className="form-input-icon">
                  <IconLock />
                </span>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <p className="auth-error" style={{ color: "#ff4d4f", fontSize: "0.875rem", marginTop: "-10px", marginBottom: "15px", textAlign: "center" }}>{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="auth-link">
            <p>
              Don&apos;t have an account?{" "}
              <Link to={"/auth/register"}>Create one</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
