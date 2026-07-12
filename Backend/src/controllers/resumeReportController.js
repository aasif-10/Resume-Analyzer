const { PDFParse } = require("pdf-parse");
const { generateResumeReport } = require("../services/ai");
const resumeModel = require("../models/resume-model");

/**
 * @route POST /upload
 * @description Upload a new resume, job description, self description
 * @access Private
 */

module.exports.resumeReportController = async (req, res) => {
  let isCancelled = false;
  req.on("close", () => {
    console.log("Client cancelled the request.");
    isCancelled = true;
  });

  let resume = req.file;
  let { jobDescription, selfDescription } = req.body;

  if (!jobDescription) {
    return res.status(401).json({
      message: "Job description is required",
      status: "failed",
    });
  }

  if (!resume && !selfDescription) {
    return res.status(401).json({
      message: "Either resume of self description is required",
      status: "failed",
    });
  }

  resume = !resume ? null : resume;
  selfDescription = !selfDescription ? null : selfDescription;

  let resumeContent = null;
  if (resume) {
    const parser = new PDFParse(Uint8Array.from(req.file.buffer));
    resumeContent = await parser.getText();
    resumeContent = resumeContent.text;
  }

  if (isCancelled) return;

  const result = await generateResumeReport(
    jobDescription,
    selfDescription,
    resumeContent,
  );

  if (isCancelled) return;

  const resumeReport = await resumeModel.create({
    user: req.user._id,
    jobDescription,
    resumeContent,
    selfDescription,
    ...result,
  });

  res.status(200).json({
    message: "success",
    resumeReport,
  });

  console.log(resumeContent);
};
