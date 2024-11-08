const Complaint = require("../models/Complaint");

// Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const complaint = new Complaint({ 
      ...req.body ,
      username: req.user.username,
      });
    await complaint.save();
    res
      .status(201)
      .json({ message: "Complaint created successfully", complaint });
  } catch (error) {
    res.status(400).json({ message: "Error creating complaint", error });
  }
};

// controllers/complaints.js
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ username: req.user.username });
    res.status(200).json(complaints);
  } catch (error) {
    res.status(400).json({ message: "Error getting complaints", error });
  }
};



exports.getAllComplaints = async (req, res) => {
  try {
    const { sort, status } = req.query; // Extract query parameters
    console.log('Received sort parameter:', sort);

    // Construct the filter object for status if status parameter is provided
    const filter = {};
    if (status) {
      // Normalize the status input to capitalize the first letter
      const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      if (["Pending", "Resolved"].includes(normalizedStatus)) {
        filter.status = normalizedStatus;
        console.log('Filter:', filter);
        console.log('Status in Query:', status);
      }
    }

    // Build the sort object
    let sortOption = {};
    if (sort === "date_desc") {
      sortOption.date = -1; // Sort by date descending
    } else if (sort === "date_asc") {
      sortOption.date = 1; // Sort by date ascending
    }

    // Query the database with the filter and sort applied
    let complaints = await Complaint.find(filter).sort(sortOption);

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error getting complaints:", error); // Log the error for debugging
    res.status(400).json({ message: "Error getting complaints", error });
  }
};



// Get a specific complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ message: "Error fetching complaint", error });
  }
};

// Update complaint status and add a reply
exports.updateComplaint = async (req, res) => {
  const { status, reply } = req.body;
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Update status and reply
    complaint.status = status || complaint.status;
    if (reply) {
      complaint.reply = reply; // Add a reply field to the Complaint schema if not already present
    }
    await complaint.save();
    res.status(200).json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res.status(400).json({ message: "Error updating complaint", error });
  }
};

