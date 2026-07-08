const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

/**
 * @route POST /auth/register
 * @description Register an user
 * @access Public
 */

module.exports.registerController = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(401).json({
      message: "Invalid credentials",
      status: "failed",
    });
  }

  let user;
  user = await userModel.findOne({ $or: [{ username }, { email }] });

  if (user) {
    return res.status(401).json({
      message: "User already exists with this email or username",
      status: "failed",
    });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Error hashing password",
          status: "failed",
        });
      }

      user = await userModel.create({
        username,
        email,
        password: hash,
      });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "3d" },
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      });
      res.status(201).json({
        message: "User registered",
        status: "passed",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  });
};
