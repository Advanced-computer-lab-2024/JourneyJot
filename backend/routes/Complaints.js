// routes/Complaints.js
const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/auth-check');
const adminMiddleware = require('../middleware/admin-check');
const {
  createComplaint,
  getComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint
} = require("../controllers/complaints");

// Apply authMiddleware and adminMiddleware to admin routes
router.get("/admin", authMiddleware, adminMiddleware, getAllComplaints);
router.get("/admin/:id", authMiddleware, adminMiddleware, getComplaintById);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateComplaint);

// Other routes
router.post("/", authMiddleware, createComplaint);
router.get("/", authMiddleware, getComplaints);
router.get("/:id", authMiddleware, getComplaintById);

module.exports = router;
