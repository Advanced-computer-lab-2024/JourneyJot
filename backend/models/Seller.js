const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
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
  Description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;
