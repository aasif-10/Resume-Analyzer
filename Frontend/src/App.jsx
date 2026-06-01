import { RouterProvider } from "react-router-dom";
import { router } from "./routes.jsx";
import { AuthProvider } from "./features/auth/auth-context.jsx";
import React from "react";
import { ResumeAnalyseProvider } from "./features/resumeAnalyse/resume-analyse-context.jsx";

const App = () => {
  return (
    <AuthProvider>
      <ResumeAnalyseProvider>
        <RouterProvider router={router} />
      </ResumeAnalyseProvider>
    </AuthProvider>
  );
};

export default App;
