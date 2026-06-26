const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    default: 'General',
    enum: ['General', 'Pricing', 'Outstation', 'Airport', 'Fleet', 'Booking', 'Wedding', 'Corporate', 'Driver'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.ChatLog || mongoose.model('ChatLog', ChatLogSchema);
