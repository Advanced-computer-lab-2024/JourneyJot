/** @format */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

// Route to delete a user
router.delete(
	'/users/:userType/:id',
	authenticateAdmin,
	adminController.deleteUser
);

// New route to add a Tourism Governor
// router.post('/users/tourismgovernor', authenticateAdmin, adminController.addTourismGovernor);

// New route to add an Admin
router.post('/users/admin', authenticateAdmin, adminController.addAdmin);

// Activity Routes with authentication
router.post('/addActivity', adminController.createActivity);
router.get('/activities', adminController.getActivities);
router.put('/updateActivity/:id', adminController.updateActivity);
router.delete('/removeActivity/:id', adminController.deleteActivity);

// Preference Tag Routes with authentication
router.post('/addTag', adminController.createTag);
router.get('/tags', adminController.getTags);
router.put('/UpdateTag/:id', adminController.updateTag);
router.delete('/removeTag/:id', adminController.deleteTag);

module.exports = router;
