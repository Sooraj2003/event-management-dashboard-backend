const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create Event
router.post('/', async (req, res) => {
  try {
    const { name, date, location } = req.body;
    const event = new Event({ name, date, location });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Event
router.put('/:id', async (req, res) => {
  try {
    const { name, date, location } = req.body;
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { name, date, location },
      { new: true }
    );
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete Event
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
