/** @format */

const express = require('express');
const authCheck = require('../middleware/auth-check');
const adminCheck = require('../middleware/admin-check');
const router = express.Router();

const {
	createComplaint,
	getComplaints,
	getComplaintById,
	updateComplaintStatus,
	replyToComplaint,
	getAllComplaints,
	getAllComplaintsForAdmin,
} = require('../controllers/complaints');

router.post('/', createComplaint);
router.get('/', getComplaints);
router.get('/admin', authCheck, adminCheck, getAllComplaints);
router.get('/admin/:id', authCheck, adminCheck, getComplaintById);
router.put('/admin/reply/:id', authCheck, adminCheck, replyToComplaint);
router.put('/admin/status/:id', authCheck, adminCheck, updateComplaintStatus);
router.get('/filter/sort', authCheck, adminCheck, getAllComplaintsForAdmin);

module.exports = router;
