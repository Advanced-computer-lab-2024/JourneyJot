const Museum = require('../models/Museum');
const HistoricalPlace = require('../models/HistoricalPlace');

exports.getMyMuseums = async (req, res) => {
    try {
        // Ensure the user is a Tourism Governor
        if (req.user.userType !== 'tourismgovernor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const museums = await Museum.find({ createdBy: req.user.id });
        res.status(200).json(museums);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyHistoricalPlaces = async (req, res) => {
    try {
        // Ensure the user is a Tourism Governor
        if (req.user.userType !== 'tourismgovernor') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const places = await HistoricalPlace.find({ createdBy: req.user.id });
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
