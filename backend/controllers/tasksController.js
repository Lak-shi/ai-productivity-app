const Task = require('../models/task'); // Keep only this at the top

exports.getAllTasks = async (req, res) => {
  try {
    const result = await Task.getAll();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const result = await Task.getById(req.params.id);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, time_estimate, due_date } = req.body;

    console.log("📌 Received Data:", req.body); // Debug log

    if (!title || !description || !priority || !time_estimate || !due_date) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const result = await Task.create(title, description, priority, time_estimate, due_date);
    console.log("📌 Saved Task:", result.rows[0]); // Debug log

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error saving task:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, priority, time_estimate, due_date } = req.body;
    const result = await Task.update(req.params.id, title, description, priority, time_estimate, due_date);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.delete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Task.markAsComplete(id);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json({ message: "Task marked as complete." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

