// Updated verifyAdmin middleware in authMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('..//models//Admin');

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        // Check if the token is missing
        if (!token) {
            return res.status(401).json({ error: 'Token is missing. Please authenticate.' });
        }

        const cleanedToken = token.replace('Bearer ', ''); // Clean token from header
        const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET); // Verify token

        const adminUser = await Admin.findOne({ _id: decoded._id });
        if (!adminUser) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        req.admin = adminUser; // Attach admin to request
        next(); // Move to the next middleware
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token. Please authenticate.' });
    }
};

module.exports = verifyAdmin;
