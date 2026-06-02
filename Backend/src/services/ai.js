require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

module.exports.generateResumeReport = async (
  jobDescription,
  selfDescription,
  resumeContent,
) => {
  const prompt = `
    Analyze the following resume against the job description
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESUME CONTENT:
    ${resumeContent}

    SELF DESCRIPTION:
    ${selfDescription}
    
    Be specific and actionable in your recommendations.
    
  `;

  const schema = {
    type: "object",
    properties: {
      jobTitle: {
        type: "string",
        description:
          "The specific job title extracted from the job description",
      },
      matchScore: {
        type: "number",
        description:
          "Numerical score from 0-100 indicating how well the resume matches the job requirements",
      },
      skillGap: {
        type: "object",
        properties: {
          missingSkills: {
            type: "array",
            items: { type: "string" },
            description:
              "List of skills required by the job that are missing from the resume",
          },
          matchedSkills: {
            type: "array",
            items: { type: "string" },
            description:
              "List of skills mentioned in the resume that match job requirements",
          },
        },
        required: ["missingSkills", "matchedSkills"],
      },
      resumeQualityRecommendation: {
        type: "object",
        properties: {
          missing: {
            type: "array",
            items: { type: "string" },
            description:
              "Essential resume sections or elements that are completely missing",
          },
          improvement: {
            type: "array",
            items: { type: "string" },
            description:
              "Specific suggestions to enhance existing resume sections",
          },
        },
        required: ["missing", "improvement"],
      },
      qualification: {
        type: "object",
        properties: {
          missingQualification: {
            type: "array",
            items: { type: "string" },
            description:
              "Required qualifications, certifications, or experiences not found in resume",
          },

          matchedQualification: {
            type: "array",
            items: { type: "string" },
            description:
              "Matched qualification,certifications, or experiences found in the self description or the resume with respect to job description",
          },
        },
        required: ["missingQualification", "matchedQualification"],
      },
      projectRecommendation: {
        type: "object",
        properties: {
          missingProjects: {
            type: "array",
            items: { type: "string" },
            description:
              "Types of projects or experiences that would strengthen the resume",
          },
          recommendedProjects: {
            type: "array",
            items: { type: "string" },
            description:
              "Specific project ideas or technologies the candidate should work with",
          },
        },
        required: ["missingProjects", "recommendedProjects"],
      },
    },
    required: [
      "jobTitle",
      "matchScore",
      "skillGap",
      "resumeQualityRecommendation",
      "qualification",
      "projectRecommendation",
    ],
  };

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const parsedResult = JSON.parse(response.text);
  return parsedResult;
};

const generatePdfFromHtml = async (htmlContent) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  });

  await browser.close();

  return pdfBuffer;
};

module.exports.generateResumePdf = async (
  jobDescription,
  selfDescription,
  resumeContent,
  resumeReport,
) => {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const schema = {
    type: "object",
    properties: {
      html: {
        type: "string",
        description: "Complete standalone HTML resume",
      },
      appliedChanges: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
    required: ["html", "appliedChanges"],
  };

  const prompt = `
You are an expert ATS Resume Writer and Career Consultant.

Resume must be within 1 Page strictly

Your task is to generate an optimized resume in HTML format by applying the recommendations from the ANALYSIS REPORT.

==================================================
JOB DESCRIPTION
==================================================

${jobDescription}

==================================================
CURRENT RESUME
==================================================

${resumeContent}

==================================================
SELF DESCRIPTION
==================================================

${selfDescription}

==================================================
ANALYSIS REPORT
==================================================

${JSON.stringify(resumeReport, null, 2)}

==================================================
OBJECTIVE
==================================================

Create an improved ATS-friendly resume by applying the recommendations from the ANALYSIS REPORT.

The generated resume must directly address:

1. Missing Skills
2. Missing Qualifications
3. Resume Quality Improvements
4. Project Recommendations
5. Structural Improvements

The ANALYSIS REPORT is the primary source of changes.

==================================================
PROCESS TO FOLLOW
==================================================

Step 1:
Review the analysis report thoroughly.

Step 2:
Identify every recommendation from:
- skillGap
- qualification
- resumeQualityRecommendation
- projectRecommendation

Step 3:
Apply all recommendations that can be supported using:
- Resume Content
- Self Description

Step 4:
Improve wording, bullet points, structure, and ATS optimization.

Step 5:
Generate the final resume in HTML format.

==================================================
STRICT RULES
==================================================

- Do NOT fabricate information.
- Do NOT invent projects.
- Do NOT invent work experience.
- Do NOT invent certifications.
- Do NOT invent achievements.
- Do NOT invent skills.

- Only use information found in:
  1. Resume Content
  2. Self Description

- Missing skills should only be added if evidence exists in the provided information.

- Project recommendations should be incorporated by improving existing project descriptions whenever possible.

- Qualification recommendations should improve presentation of existing qualifications rather than creating new ones.

- Resume quality recommendations should be applied throughout the resume.

- Use strong action verbs.

- Optimize keyword usage for ATS.

- Make project descriptions concise and impactful.

- Ensure the final resume is highly relevant to the job description.

==================================================
HTML REQUIREMENTS
==================================================

Return a complete standalone HTML document.

The HTML must include:

- <!DOCTYPE html>
- <html>
- <head>
- <style>
- <body>

Resume sections must appear in the following order:

1. Header
2. Professional Summary (if applicable)
3. Experience (if available)
4. Projects
5. Skills
6. Education
7. Achievements (if available)
8. Certifications (if available)

==================================================
DESIGN REQUIREMENTS
==================================================

The resume must visually resemble a professional LaTeX-style resume.

Use:

- Clean single-column layout
- Professional ATS-friendly structure
- Compact spacing
- Strong typography hierarchy
- Minimalist appearance
- Clear section dividers
- Bullet points for projects and experience

Do NOT use:

- Images
- Icons
- Charts
- Graphics
- Progress bars
- Multi-column layouts
- Excessive colors
- Tables unless absolutely necessary

==================================================
CSS REQUIREMENTS
==================================================

- Embed all CSS inside a <style> tag.
- Do not use external CSS files.
- Do not use external fonts.
- Do not use JavaScript.

Use:

font-family: Arial, Helvetica, sans-serif;

The layout must be optimized for A4 PDF generation.

Use:

- Consistent spacing
- Readable font sizes
- Professional margins
- Section headings with bottom borders
- Proper line-height
- Clean alignment

==================================================
PUPPETEER COMPATIBILITY
==================================================

The generated HTML must render correctly in Puppeteer.

Everything must be self-contained.

No external resources.

No CDN links.

No JavaScript.

==================================================
OUTPUT REQUIREMENTS
==================================================

Return a response that conforms to the provided schema.

The "html" field must contain the complete HTML document.

The "appliedChanges" field must contain a list of all modifications made using the analysis report.

Do not wrap HTML inside markdown code fences.

Do not provide explanations.

Do not return markdown.

Return only content matching the schema.

CRITICAL REQUIREMENT

Generate the resume using ONLY the candidate information present in:

1. CURRENT RESUME
2. SELF DESCRIPTION

combining the resume report for improvement
Never generate a resume template.

Never use placeholders.

Forbidden outputs include:

[NAME]
[EMAIL]
[PHONE]
[PROJECT NAME]
[COMPANY NAME]
[UNIVERSITY NAME]
[SKILL 1]

If any field is unavailable, omit it completely.

Every section must contain real candidate information extracted from the provided inputs.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });
  const jsonResult = JSON.parse(response.text.trim());

  const htmlContent = jsonResult.html;

  const pdfBuffer = await generatePdfFromHtml(htmlContent);
  return pdfBuffer;
};
