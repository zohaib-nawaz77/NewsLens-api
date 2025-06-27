const jwt = require("jsonwebtoken");

module.exports.googleCallbackController = async (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET);
  res.redirect(`http://localhost:5173/?token=${token}`);
};
