const jwt = require("jsonwebtoken");

module.exports.googleCallbackController = async (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.redirect(
    `https://the-news-lens.vercel.app/?token=${token}`
  );
};
