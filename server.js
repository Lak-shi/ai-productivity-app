const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Task Routes
const tasksRouter = require("./routes/tasks");
app.use("/tasks", tasksRouter);

// Improved AI Prioritization Route with Debugging
app.post("/tasks/prioritize", async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Invalid tasks input. Must be a non-empty array." });
    }

    console.log("📌 Received tasks for AI prioritization:", tasks);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI-powered task prioritization assistant. Sort the given tasks based on:
          - Priority level (High > Medium > Low)
          - Earliest due date first
          - Shortest time estimate first (if the same due date & priority).
          
          Return the tasks in a JSON array sorted accordingly.`,
        },
        {
          role: "user",
          content: JSON.stringify(tasks),
        },
      ],
    });

    console.log("📌 OpenAI Raw Response:", response);

    // Extract response and parse it
    if (!response.choices || response.choices.length === 0) {
      throw new Error("OpenAI response is empty or invalid.");
    }

    const aiMessage = response.choices[0]?.message?.content;
    if (!aiMessage) {
      throw new Error("OpenAI response format is incorrect.");
    }

    const reorderedTasks = JSON.parse(aiMessage);
    console.log("✅ AI-Sorted Tasks:", reorderedTasks);

    res.json(reorderedTasks);
  } catch (error) {
    console.error("❌ AI Prioritization Error:", error);
    res.status(500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 5002;
app.get("/", (req, res) => {
  res.send("Welcome to the AI Productivity App API!");
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
