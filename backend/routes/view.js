const express = require('express');
const viewController = require('../controllers/viewController');
const router = express.Router();

// Route to view all upcoming activities, itineraries, and museums
router.get('/view-all', viewController.viewAll);

module.exports = router;
