const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @route POST /auth/login
 * @description Login an user
 * @access Public
 */

module.exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      message: "Invalid credentials",
      status: "failed",
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
      status: "failed",
    });
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res.status(401).json({
      message: "Invalid password or email",
      status: "failed",
    });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  });
  res.status(201).json({
    message: "Logged in",
    status: "passed",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};
