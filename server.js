import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

const API_KEY = "bedd95a4b2a5197695b57155a63c617c814dd0e8"; 

app.get("/news", async (req, res) => {
    try {
        const response = await fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&public=true`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use. Trying another port...`);
      process.exit(1);
    }
  });
