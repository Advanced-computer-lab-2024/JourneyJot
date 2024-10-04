
const bcrypt = require('bcryptjs');
const Tourist = require('../models/Tourist');
const Advertiser = require('../models/Advertiser');
const TourGuide = require('../models/TourGuide');
const Seller = require('../models/Seller');
// const TourismGovernor = require('../models/TourismGovernor');
const Admin = require('../models/Admin');
const Activity = require('../models/Activity');
const PreferenceTag = require('../models/PreferenceTag');

// Controller to delete a user
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userType = req.params.userType.toLowerCase();

        let userModel;
        switch (userType) {
            case 'tourist':
                userModel = Tourist;
                break;
            case 'advertiser':
                userModel = Advertiser;
                break;
            case 'tourguide':
                userModel = TourGuide;
                break;
            case 'seller':
                userModel = Seller;
                break;
            case 'tourismgovernor':
                userModel = TourismGovernor;
                break;
            case 'admin':
                userModel = Admin;
                break;
            default:
                return res.status(400).json({ message: 'Invalid user type' });
        }

        const user = await userModel.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: `${userType} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to add a Tourism Governor
exports.addTourismGovernor = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username already exists
        const existingUser = await TourismGovernor.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new Tourism Governor
        const newGovernor = new TourismGovernor({
            username,
            password: hashedPassword,
            // ... any other fields you might have
        }); ///do this or not?

        await newGovernor.save();

        res.status(201).json({ message: 'Tourism Governor created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide a username and password' });
        }

        // Check if username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new Admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
            // ... any other fields you might have
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Activity Category Methods

// Create Activity
exports.createActivity = async (req, res) => {
    const activity = new Activity(req.body);
    try {
        await activity.save();
        res.status(201).send(activity);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get Activities
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.send(activities);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update Activity
exports.updateActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!activity) {
            return res.status(404).send();
        }
        res.send(activity);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Activity
exports.deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).send();
        }
        res.send(activity);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Preference Tag Methods

// Create Preference Tag
exports.createTag = async (req, res) => {
    const tag = new PreferenceTag(req.body);
    try {
        await tag.save();
        res.status(201).send(tag);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get Preference Tags
exports.getTags = async (req, res) => {
    try {
        const tags = await PreferenceTag.find();
        res.send(tags);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update Preference Tag
exports.updateTag = async (req, res) => {
    try {
        const tag = await PreferenceTag.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tag) {
            return res.status(404).send();
        }
        res.send(tag);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete Preference Tag
exports.deleteTag = async (req, res) => {
    try {
        const tag = await PreferenceTag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).send();
        }
        res.send(tag);
    } catch (error) {
        res.status(500).send(error);
    }
};
