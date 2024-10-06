const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',  // Default role is 'admin'
  },
  fullName: {
    type: String,
    default: 'Unnamed Admin',  // Default value if not provided
  },
  email: {
    type: String,
    unique: true,      // Ensure that non-null emails are unique
    sparse: true       // Allow null or undefined emails without throwing an error
  },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
