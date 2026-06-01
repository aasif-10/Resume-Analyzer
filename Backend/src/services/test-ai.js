const mockJobDescription = require("../services/temp");
const mockResumeContent = require("../services/temp");
const { generateResumeReport } = require("./ai");

(async () => {
  try {
    const report = await generateResumeReport(mockJobDescription, mockJobDescription, mockResumeContent);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error("Error generating report:", error);
  }
})();
