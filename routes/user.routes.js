const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /me route:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
