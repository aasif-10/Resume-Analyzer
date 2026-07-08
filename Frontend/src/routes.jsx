import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Upload from "./features/resumeAnalyse/pages/Upload";
import Analyse from "./features/resumeAnalyse/pages/Analyse";

import React from "react";
import Preview from "./features/resumeAnalyse/pages/Preview";
import Reports from "./features/resumeAnalyse/pages/Reports";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/auth/register" /> },
  {
    path: "/upload",
    element: (
      <Protected>
        <Upload />
      </Protected>
    ),
  },
  { path: "/auth/login", element: <Login></Login> },
  { path: "/auth/register", element: <Register></Register> },
  {
    path: "/resume-analyse/:id",
    element: (
      <Protected>
        <Analyse></Analyse>
      </Protected>
    ),
  },
  {
    path: "/resume-preview/:id",
    element: (
      <Protected>
        <Preview></Preview>
      </Protected>
    ),
  },
  {
    path: "/reports",
    element: (
      <Protected>
        <Reports></Reports>
      </Protected>
    ),
  },
]);
