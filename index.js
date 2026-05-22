const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// If you're NOT on Node 18+, uncomment this:
// const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.send("AI server is running");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        ok: false,
        error: "No message provided"
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a short Roblox NPC. Keep replies under 120 characters."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Groq failed",
        details: data
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        ok: false,
        error: "No reply from model",
        raw: data
      });
    }

    return res.json({
      ok: true,
      reply: reply.trim()
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Server crash",
      details: err.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
