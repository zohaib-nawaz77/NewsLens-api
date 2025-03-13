const { sendDailyNews } = require("../subscription");
require("../config/mongodb");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    await sendDailyNews();
    res.status(200).json({ message: "Daily news sent successfully" });
  } catch (error) {
    console.error("Error in daily news cron:", error);
    res.status(500).json({ error: "Failed to send daily news" });
  }
};
