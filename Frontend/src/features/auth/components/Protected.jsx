import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "14px",
        background: "#0d0d0d",
        zIndex: 9999,
      }}>
        <div style={{
          width: 36,
          height: 36,
          border: "2.5px solid rgba(255,255,255,0.08)",
          borderTopColor: "rgba(255,255,255,0.85)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{
          fontSize: "0.82rem",
          color: "rgba(255,255,255,0.35)",
          fontFamily: "Inter, sans-serif",
          margin: 0,
        }}>Loading...</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to={"/auth/login"}></Navigate>;
  }

  return children;
};

export default Protected;
