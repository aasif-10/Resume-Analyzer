import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Upload from "./features/resumeAnalyse/pages/Upload";
import Analyse from "./features/resumeAnalyse/pages/Analyse";

import React from "react";

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
]);
