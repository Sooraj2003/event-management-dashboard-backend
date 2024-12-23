const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  eventName: { type:String, required: true}
 
});

module.exports = mongoose.model('Task', TaskSchema);