const mongoose = require("mongoose");

const skillGapSchema = mongoose.Schema(
  {
    missingSkills: [
      {
        type: String,
        default: [],
      },
    ],

    matchedSkills: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { _id: false },
);

const resumeQualitySchema = mongoose.Schema(
  {
    missing: [
      {
        type: String,
        required: true,
        default: [],
      },
    ],
    improvement: [
      {
        type: String,
        required: true,
        default: [],
      },
    ],
  },
  { _id: false },
);

const qualificationSchema = mongoose.Schema(
  {
    missingQualification: [
      {
        type: String,
        default: [],
      },
    ],
    matchedQualification: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { _id: false },
);

const projectSchema = mongoose.Schema(
  {
    missingProjects: [
      {
        type: String,
        default: [],
      },
    ],

    recommendedProjects: [
      {
        type: String,
        default: [],
      },
    ],
  },
  { _id: false },
);

const resumeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
  },

  resumeContent: {
    type: String,
  },

  selfDescription: {
    type: String,
  },

  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },

  skillGap: skillGapSchema,
  resumeQualityRecommendation: resumeQualitySchema,
  qualification: qualificationSchema,
  projectRecommendation: projectSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("resume", resumeSchema);
