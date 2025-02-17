// server.js
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

app.use(cors());

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
        apiKey: "b3d2f387bb514c2e80b6b706e5fb67c9",
      },
    });
    res.json(data.articles);
    // console.log(data.articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Proxy server running on port 3001"));
