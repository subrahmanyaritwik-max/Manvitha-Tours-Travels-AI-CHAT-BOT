const mongoose = require('mongoose');

const CustomerProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  bookingCount: {
    type: Number,
    default: 1,
  },
  preferences: {
    type: [String],
    default: [],
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.CustomerProfile || mongoose.model('CustomerProfile', CustomerProfileSchema);
