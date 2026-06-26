const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  pickupDate: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: false,
  },
  destination: {
    type: String,
    required: false,
  },
  passengerCount: {
    type: Number,
    required: false,
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
