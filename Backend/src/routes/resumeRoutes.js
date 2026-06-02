const express = require("express");
const router = express.Router();

const upload = require("../config/multer-config");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const {
  resumeReportController,
} = require("../controllers/resumeReportController");
const resumeModel = require("../models/resume-model");

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
