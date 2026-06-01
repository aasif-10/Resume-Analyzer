require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

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
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const parsedResult = JSON.parse(response.text);
  return parsedResult;
};
