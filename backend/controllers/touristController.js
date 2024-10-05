const Tourist = require('..//models//Tourist');

// Controller to get the tourist's information (including all fields except password)
exports.getTouristDetails = async (req, res) => {
  try {
    const touristId = req.tourist._id; // Assuming verifyTourist middleware attaches tourist to req
    const tourist = await Tourist.findById(touristId).select('-password'); // Exclude password from the result
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Controller to update tourist's information (excluding username, wallet, and DOB)
exports.updateTouristDetails = async (req, res) => {
  try {
    const touristId = req.tourist._id;
    const { fullName, mobileNumber, nationality, jobOrStudent } = req.body; // Allow these fields to be updated

    // Ensure no username, wallet, or DOB update
    const updatedTourist = await Tourist.findByIdAndUpdate(
      touristId,
      { fullName, mobileNumber, nationality, jobOrStudent }, // Allow updating these fields
      { new: true, runValidators: true, select: '-password' } // Ensure no password is returned
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    res.json(updatedTourist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
