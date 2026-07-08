const express = require("express");
const router = express.Router();

const upload = require("../config/multer-config");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const {
  resumeReportController,
} = require("../controllers/resumeReportController");
const resumeModel = require("../models/resume-model");
const { generateResumePdf } = require("../services/ai");

/**
 * @route POST /upload
 * @description Upload a new resume, job description, self description
 * @access Private
 */

router.post(
  "/upload",
  isLoggedIn,
  upload.single("resume"),
  resumeReportController,
);

/**
 * @route GET /all
 * @description Get all resumes for a user
 * @access Private
 */
router.get("/all", isLoggedIn, async (req, res) => {
  const userId = req.user._id;

  const resumeReports = await resumeModel
    .find({ user: userId })
    .sort({ createdAt: -1 });

  if (!resumeReports) {
    return res.status(401).json({
      message: "No resume found for user",
    });
  }

  res.status(200).json({
    resumeReports: resumeReports,
  });
});

/**
 * @route GET /modified/:id
 * @description Generate an optimized resume PDF for a given resume ID
 * @access Private
 * NOTE: This route must be defined BEFORE /:id to avoid Express matching
 * "modified" as the :id parameter.
 */
router.get("/modified/:id", isLoggedIn, async (req, res) => {
  const resumeId = req.params.id;

  const resume = await resumeModel.findById(resumeId);

  if (!resume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }

  const {
    jobDescription,
    selfDescription,
    resumeContent,
    matchScore,
    skillGap,
    resumeQualityRecommendation,
    qualification,
    projectRecommendation,
  } = resume;

  const resumeReport = {
    "matchScore": matchScore,
    "skillGap": skillGap,
    "resumeQualityRecommendation": resumeQualityRecommendation,
    "qualification": qualification,
    "projectRecommendation": projectRecommendation,
  };

  const pdfBuffer = await generateResumePdf(
    jobDescription,
    selfDescription,
    resumeContent,
    resumeReport,
  );

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=modified_resume_${resumeId}.pdf`,
  });
  res.send(pdfBuffer);
});

/**
 * @route GET /:id
 * @description Get a resume by ID
 * @access Private
 */
router.get("/:id", isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const resumeReport = await resumeModel.findById(id);

  if (!resumeReport) {
    return res.status(401).json({
      message: "No resume found by id",
    });
  }

  res.status(200).json({
    resumeReport: resumeReport,
  });
});

module.exports = router;
