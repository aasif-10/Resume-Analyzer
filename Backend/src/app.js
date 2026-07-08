const express = require("express");
const path = require("path");
const mongooseConnection = require("./config/mongoose-connection");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://resume-analyzer-two-lyart.vercel.app",
    ],
    credentials: true,
  }),
);

/* database models */
const userModel = require("./models/user-model");
const tokenBlacklistModel = require("./models/token-blacklist-model");
const resumeModel = require("./models/resume-model");

/* Routes */
const authRoutes = require("../src/routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
/* Use routes */
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

module.exports = app;
