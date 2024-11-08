/** @format */

const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
	try {
		// Log the request body to ensure data is being received correctly
		console.log('Received complaint data:', req.body);

		// Create a new complaint document
		const complaint = new Complaint({ ...req.body });

		// Save the complaint to the database
		await complaint.save();

		// Send a success response with the saved complaint
		res.status(201).json({
			message: 'Complaint created successfully',
			complaint,
		});
	} catch (error) {
		// Log the error message to console for debugging
		console.error('Error creating complaint:', error.message);

		// Respond with an error message and error details
		res.status(400).json({
			message: 'Error creating complaint',
			error: error.message,
		});
	}
};
// Get all complaints
exports.getComplaints = async (req, res) => {
	try {
		const complaints = await Complaint.find();
		res.status(200).json(complaints);
	} catch (error) {
		res.status(400).json({ message: 'Error getting complaints', error });
	}
};

// Get all complaints, with optional status filter
exports.getAllComplaints = async (req, res) => {
	try {
		const status = req.query.status; // Use query parameter to filter by status
		const filter = status ? { status } : {}; // If status is provided, add it to the filter
		const complaints = await Complaint.find(filter);
		res.status(200).json(complaints);
	} catch (error) {
		res.status(400).json({ message: 'Error getting complaints', error });
	}
};
// Get complaint details by ID
exports.getComplaintById = async (req, res) => {
	try {
		const complaint = await Complaint.findById(req.params.id);
		if (!complaint) {
			return res.status(404).json({ message: 'Complaint not found' });
		}
		res.status(200).json(complaint);
	} catch (error) {
		res.status(400).json({ message: 'Error getting complaint details', error });
	}
};
// Update complaint status (e.g., mark as pending or resolved)
exports.updateComplaintStatus = async (req, res) => {
	try {
		console.log('Complaint ID:', req.params.id);
		console.log('Status:', req.body.status);
		const { status } = req.body;
		const complaint = await Complaint.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		);
		console.log('Updated Complaint:', complaint);
		if (!complaint) {
			return res.status(404).json({ message: 'Complaint not found' });
		}
		res.status(200).json({ message: 'Complaint status updated', complaint });
	} catch (error) {
		res.status(400).json({ message: 'Error updating complaint status', error });
	}
};

// Reply to a complaint
exports.replyToComplaint = async (req, res) => {
	try {
		const { reply } = req.body; // Get the reply content from the request
		const complaint = await Complaint.findByIdAndUpdate(
			req.params.id,
			{ reply },
			{ new: true }
		);
		if (!complaint) {
			return res.status(404).json({ message: 'Complaint not found' });
		}
		res.status(200).json({ message: 'Reply added to complaint', complaint });
	} catch (error) {
		res.status(400).json({ message: 'Error replying to complaint', error });
	}
};
exports.getAllComplaintsForAdmin = async (req, res) => {
	try {
		const { sortOrder = 'desc', status } = req.query;

		// Create a filter object based on the status parameter
		let filter = {};
		if (status) {
			filter.status = status;
		}

		// Fetch complaints with sorting and filtering applied
		const complaints = await Complaint.find(filter).sort({
			date: sortOrder === 'asc' ? 1 : -1,
		}); // 1 for ascending, -1 for descending

		res.status(200).json(complaints);
	} catch (error) {
		console.error('Error fetching complaints:', error);
		res.status(500).json({ message: 'Error fetching complaints' });
	}
};
