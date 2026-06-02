# AI Resume Analyzer & Optimizer

A full-stack application that leverages Google's Gemini AI to analyze resumes against specific job descriptions and automatically generate optimized, ATS-friendly resumes.

## Purpose

In today's competitive job market, Applicant Tracking Systems (ATS) filter out many qualified candidates before a human ever sees their resume. The purpose of this project is to bridge the gap between a candidate's actual qualifications and the specific requirements of a job description. 

By utilizing advanced AI (Google Gemini), this platform not only provides a detailed analysis of skill gaps, missing qualifications, and structural improvements, but it also goes a step further by **automatically generating a newly optimized, ATS-compliant PDF resume** based on the analysis.

## Key Features

- **Resume Parsing:** Upload existing PDF resumes and automatically extract content.
- **AI-Powered Analysis:** Compare your resume and self-description against a target Job Description.
- **Detailed ATS Report:** Get insights on Match Score, Skill Gaps, Missing Qualifications, and Project Recommendations.
- **Auto-Optimization:** Automatically generate an optimized, 1-page, ATS-friendly HTML/PDF resume using Puppeteer and Gemini AI.
- **User Authentication:** Secure user accounts with JWT and bcrypt to save and manage past analysis reports.
- **Modern UI/UX:** Clean, responsive frontend built with React and Sass for a seamless user experience.

## Technology Stack

### Backend
- **Node.js & Express:** Robust REST API server.
- **MongoDB & Mongoose:** Database for storing users, resumes, and reports.
- **Google GenAI SDK (`@google/genai`):** Core AI engine for analysis and generation.
- **Puppeteer:** Headless browser for converting optimized HTML resumes into A4 PDFs.
- **Multer & PDF-Parse:** Handling file uploads and extracting text from PDFs.
- **Zod:** Schema validation for API requests and AI structured JSON outputs.

### Frontend
- **React 19 & Vite:** Lightning-fast frontend framework and bundler.
- **React Router DOM:** Client-side routing.
- **Sass (SCSS):** Advanced, modular styling.
- **Axios:** Promise-based HTTP client for API communication.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the Backend directory and add your variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the [ISC License](LICENSE).

```text
Copyright (c) 2024

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
