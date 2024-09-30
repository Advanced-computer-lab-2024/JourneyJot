const jwt = require('jsonwebtoken');

exports.authenticateAdmin = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if user is admin
        if (decoded.userType !== 'admin') {
            return res.status(403).json({ message: 'Authorization denied: Admins only' });
        }
        // Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info (e.g., id, userType) to the request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

