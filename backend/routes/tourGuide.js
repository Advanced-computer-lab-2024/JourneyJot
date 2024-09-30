const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/tourGuideController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Route to get all activities created by the logged-in Tour Guide
router.get('/activities', authenticateUser, tourGuideController.getMyActivities);

// Route to get all itineraries created by the logged-in Tour Guide
router.get('/itineraries', authenticateUser, tourGuideController.getMyItineraries);

// Route to get the logged-in Tour Guide's profile
router.get('/profile', authenticateUser, tourGuideController.getProfile);

// Route to update the logged-in Tour Guide's profile
router.put('/profile', authenticateUser, tourGuideController.updateProfile);

router.put(
  '/profile',
  authenticateUser,
  [
    body('fullName').optional().isString().withMessage('Full name must be a string'),
    body('mobileNumber').optional().isMobilePhone().withMessage('Invalid mobile number'),
    body('yearsOfExperience').optional().isInt({ min: 0 }).withMessage('Years of experience must be a non-negative integer'),
    body('previousWork').optional().isString().withMessage('Previous work must be a string'),
    body('bio').optional().isString().withMessage('Bio must be a string'),
    body('profileImage').optional().isURL().withMessage('Profile image must be a valid URL'),
  ],
  tourGuideController.updateProfile
);

module.exports = router;