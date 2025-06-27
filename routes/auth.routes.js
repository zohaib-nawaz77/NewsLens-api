const express = require("express");
const router = express.Router();
const passport = require("passport");
const { googleCallbackController } = require("../controllers/auth.controller");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/login",
  }),
  googleCallbackController
);

module.exports = router;
