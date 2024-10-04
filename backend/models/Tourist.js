const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristSchema = new Schema({
  Username: {
    type: String,
    required: true,
    unique: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  },
  MobileNumber: {
    type: String,
    required: true
  },
  Nationality: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    required: true,
    immutable: true // Ensures DOB cannot be changed
  },
  JobOrStudent: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Tourist = mongoose.model('Tourist', touristSchema);
module.exports = Tourist;
