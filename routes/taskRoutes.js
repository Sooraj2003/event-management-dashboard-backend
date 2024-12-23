const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Create Task
router.post('/', async (req, res) => {
  try {
    const { name, eventName } = req.body;
    const task = new Task({ name, eventName });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Tasks by Event ID
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Task Status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
