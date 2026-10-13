# AI Resume Analyzer — Frontend Client

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-v7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?logo=sass&logoColor=white)](https://sass-lang.com/)
[![Axios](https://img.shields.io/badge/Axios-1.14-5A29E4?logo=axios&logoColor=white)](https://axios-http.com/)

A modern, responsive Single Page Application (SPA) built with React 19, Vite, and Sass for analyzing resumes against job descriptions, reviewing ATS breakdown reports, and downloading newly synthesized resumes.

---

## Architecture & Features

```mermaid
flowchart TD
    App[App Component] --> Router[React Router DOM v7]
    Router --> PublicRoutes[Public Routes: /auth/login, /auth/register]
    Router --> ProtectedRoutes[Protected Routes: /upload, /resume-analyse/:id, /resume-preview/:id, /reports]
    ProtectedRoutes --> Context[ResumeAnalyseContext & Auth State]
    Context --> Axios[Axios API Client with Credentials]
    Axios --> BackendAPI[Backend REST API]
```

### Feature Modules
- **Authentication (`/features/auth`)**: Login and registration flows, session persistence, and `Protected` wrapper guarding authenticated views.
- **Resume Analysis (`/features/resumeAnalyse`)**:
  - `Upload`: Multi-input interface supporting PDF drag-and-drop, target job description textarea, and supplementary candidate summary.
  - `Analyse`: Interactive dashboard presenting ATS match score, missing vs matched skills, credential gap breakdowns, and project suggestions.
  - `Preview`: Formatted visual display of the candidate resume.
  - `Reports`: Historical dashboard listing all previous resume audits with direct navigation and re-download capabilities.

---

## Directory Structure

```text
Frontend/
├── public/                 # Static assets
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/ # Protected route guard
│   │   │   ├── pages/      # Login.jsx, Register.jsx
│   │   │   └── services/   # Auth API calls
│   │   └── resumeAnalyse/
│   │       ├── hooks/      # Custom hooks
│   │       ├── pages/      # Upload, Analyse, Preview, Reports
│   │       ├── services/   # Resume API calls & PDF download handlers
│   │       ├── style/      # Feature-specific SCSS modules
│   │       └── resume-analyse-context.jsx # Resume global state provider
│   ├── routes.jsx          # Route definitions & navigation tree
│   ├── style.scss          # Global styling tokens & layouts
│   ├── main.jsx            # Application bootstrap
│   └── App.jsx             # Root React component
├── .env.development        # Local API URL configuration
├── .env.production         # Production deployment API endpoint
├── package.json            # Scripts and dependencies
└── vite.config.js          # Vite build config
```

---

## Getting Started

### Prerequisites
- Node.js `20.x` or higher
- Running backend service (see [Backend README](../Backend/README.md))

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create or update the environment files:

- **`.env.development`** (local backend):
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```
- **`.env.production`** (production backend):
  ```env
  VITE_API_URL=https://your-production-backend.com/api
  ```

### 3. Run Development Server
```bash
npm run dev
```
Access the application at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory. You can preview the production build locally using:
```bash
npm run preview
```

---

## License

This project is licensed under the [ISC License](../LICENSE).
