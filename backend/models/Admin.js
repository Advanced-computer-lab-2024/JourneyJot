import mongoose from 'mongoose';
import { isAlpha, isAlphaNumeric } from '../../helper/validation.js';
import idvalidator from "mongoose-id-validator";


const adminSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
  },
  password: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
  },
  role: {
      type: String,
      enum: ['superadmin', 'admin', 'moderator'],
      default: 'admin',
  },
  createdAt: {
      type: Date,
      default: Date.now,
  },
  updatedAt: {
      type: Date,
      default: Date.now,
  }
});

// Middleware to update the `updatedAt` field before saving
adminSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the Admin model
export default mongoose.model('Admin', adminSchema);

