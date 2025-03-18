const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.get('/', tasksController.getAllTasks); // Ensure GET /tasks exists
router.get('/:id', tasksController.getTaskById);
router.post('/', tasksController.createTask);
router.put('/:id', tasksController.updateTask);
router.put('/:id/complete', tasksController.updateTaskCompletion); // Mark task as complete
router.delete('/:id', tasksController.deleteTask);

module.exports = router; // Only one module.exports
