const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const Task = {
  getAll: () => pool.query("SELECT id, title, description, priority, time_estimate, due_date, completed FROM tasks ORDER BY completed ASC, due_date ASC"),
  getById: (id) => pool.query("SELECT * FROM tasks WHERE id = $1", [id]),
  create: (title, description, priority, time_estimate, due_date) =>
    pool.query(
      "INSERT INTO tasks (title, description, priority, time_estimate, due_date, completed) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *",
      [title, description, priority, time_estimate, due_date]
    ),
  update: (id, title, description, priority, time_estimate, due_date) =>
    pool.query(
      "UPDATE tasks SET title = $1, description = $2, priority = $3, time_estimate = $4, due_date = $5 WHERE id = $6 RETURNING *",
      [title, description, priority, time_estimate, due_date, id]
    ),
  markAsComplete: (id) => pool.query("UPDATE tasks SET completed = TRUE WHERE id = $1", [id]), 
  delete: (id) => pool.query("DELETE FROM tasks WHERE id = $1", [id]),
};

module.exports = Task;

