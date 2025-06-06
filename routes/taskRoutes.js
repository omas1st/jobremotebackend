// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');
const { attemptTask } = require('../controllers/userController');

/**
 * GET /api/tasks
 * Return a list of all tasks (for workers to see available tasks).
 */
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/tasks/attempt
 * Mark a task as “attempted” by this user.
 * Body: { taskId }
 */
router.post('/attempt', auth, attemptTask);

module.exports = router;
