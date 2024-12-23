const express = require('express');
const router = express.Router();
const Attendee = require('../models/Attendee');

// Add Attendee
router.post('/', async (req, res) => {
  try {
    const { name, email, eventId } = req.body;
    const attendee = new Attendee({ name, email, eventId });
    await attendee.save();
    res.status(201).json(attendee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Attendees
router.get('/', async (req, res) => {
  try {
    const attendees = await Attendee.find().populate('eventId');
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Attendee
router.delete('/:id', async (req, res) => {
  try {
    await Attendee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendee deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
