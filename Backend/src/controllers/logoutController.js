const tokenBlacklistModel = require("../models/token-blacklist-model");

/**
 * @route POST /auth/logout
 * @description Logout an user
 * @access Public
 */

module.exports.logoutController = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  await tokenBlacklistModel.create({ token });

  res.status(200).json({
    message: "User logged out",
    status: "passed",
  });
};
