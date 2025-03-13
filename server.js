const express = require("express");
const app = express();
const axios = require("axios");
const Subscriber = require("./model/subscriber");
const { sendWelcomeEmail } = require("./subscription");
const cors = require("cors");
require("./config/mongodb");
require("dotenv").config();

app.use(
  cors({
    origin: "https://the-news-lens.vercel.app",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome.! This is Home Route!" });
});

app.get("/api/news", async (req, res) => {
  try {
    const { category } = req.query;
    const { data } = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us",
        category: category || "general",
        apiKey: process.env.API_KEY,
      },
    });
    res.json(data.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "You are already subscribed!" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();
    sendWelcomeEmail(email);
    res.json({ message: "You have subscribed successfully!", email });
  } catch (error) {
    console.error("Error handling subscription:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app; // Export for Vercel serverless function
