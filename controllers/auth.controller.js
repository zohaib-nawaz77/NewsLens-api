const jwt = require("jsonwebtoken");

module.exports.googleCallbackController = async (req, res) => {
  try {
    // Sign the JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Determine the redirect URL based on the environment
    let redirectUrl;
    if (process.env.NODE_ENV === "development") {
      redirectUrl = `http://localhost:5173`;
    } else {
      redirectUrl = `https://the-news-lens.vercel.app`;
    }

    // Set the token as an HTTP-only cookie for security
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookie in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    // Redirect to the frontend
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in googleCallbackController:", error);
    res.status(500).send("Authentication failed");
  }
};