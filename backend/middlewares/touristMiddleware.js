const jwt = require('jsonwebtoken');
const Tourist = require('..//models//Tourist');

const verifyTourist = async (req, res, next) => {
  try {
    const token = req.header('Authorization');

    if (!token) {
      return res.status(401).json({ error: 'Token is missing. Please authenticate.' });
    }

    const cleanedToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET);

    const touristUser = await Tourist.findById(decoded._id);
    if (!touristUser) {
      return res.status(403).json({ error: 'Access denied. Tourists only.' });
    }

    req.tourist = touristUser; // Attach tourist to request
    next(); // Proceed to next middleware/controller
  } catch (error) {
    res.status(401).json({ error: 'Invalid token. Please authenticate.' });
  }
};

module.exports = verifyTourist;
