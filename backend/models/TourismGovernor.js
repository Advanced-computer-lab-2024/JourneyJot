const mongoose = require('mongoose');

const TourismGovernorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    immutable: true,  // Cannot change username once set
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    default: 'Unnamed Governor',  // Default value if not provided
  },
  email: {
    type: String,
    default: 'noemail@provided.com',  // Default value if not provided
  },
  mobileNumber: {
    type: String,
    default: '0000000000',  // Default value if not provided
  },
  region: {
    type: String,
    default: 'Unknown Region',  // Default value if not provided
  },
}, { timestamps: true });

module.exports = mongoose.model('TourismGovernor', TourismGovernorSchema);
