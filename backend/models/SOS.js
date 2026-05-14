const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  name: { type: String, required: false, default: 'Citizen' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  emergencyType: { type: String, required: false, default: 'General Emergency' },
  message: { type: String, required: false, default: 'Immediate assistance requested' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'active', enum: ['active', 'resolved'] }
});

const SOS = mongoose.model('SOS', sosSchema);

module.exports = SOS;
