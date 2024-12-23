const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description:{type: String},
  date: { type: Date, required: true ,default: Date.now },
  location: { type: String, required: true },

});

module.exports = mongoose.model('Event', EventSchema);
