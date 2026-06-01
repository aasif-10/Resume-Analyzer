import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function generateResumeReport({
  jobDescription,
  selfDescription,
  resumeFile,
}) {
  try {
    const formData = new FormData();

    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resumeFile);

    const response = await api.post("/resume/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getResumeById(resumeId) {
  try {
    const response = await api.get(`/resume/${resumeId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
