/** @format */
const Tourist = require("../models/Tourist");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary");
const Attraction = require("../models/Attraction");
const TourGuide = require("../models/Tour-Guide");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  const {
    username,
    email,
    password,
    mobileNumber,
    nationality,
    dob,
    occupation,
  } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !mobileNumber ||
    !dob ||
    !nationality ||
    !occupation
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  bcrypt.hash(password, 10, (error, hashed) => {
    if (error) {
      res.status(500).send({ message: error.message });
    }
    const newTourist = new Tourist({
      username,
      email,
      password: hashed,
      mobileNumber,
      nationality,
      dob,
      occupation,
    });
    newTourist
      .save()

      .then((result) => {
        res
          .status(201)
          .json({ message: "User created successfully", user: result });
      })
      .catch((error) => {
        res.status(500).send({ message: error.message, error });
      });
  });
};

exports.login = (req, res, next) => {
  Tourist.find({ username: req.body.username })
    .exec()
    .then((tourist) => {
      if (tourist.length < 1) {
        return res
          .status(401)
          .json({ message: "Auth failed username does not exist" });
      }
      bcrypt.compare(req.body.password, tourist[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Auth failed" });
        } else if (result) {
          jwt.sign(
            { username: tourist[0].username, _id: tourist[0]._id },
            "cr7",
            {
              expiresIn: "12h",
            },
            (errors, results) => {
              if (errors) {
                return res.status(500).json({ error: errors.message });
              }
              return res.status(200).json({
                message: "Authentication successful",
                token: results,
              });
            }
          );
        } else {
          return res
            .status(401)
            .json({ message: "Auth failed incorrect password" });
        }
      });
    })
    .catch((error) => {
      console.log("Error finding user:", error);
      return res.status(401).json({ message: "Authentication failed" });
    });
};

// Get tourist profile
exports.getTouristProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using a middleware to attach user info to req.user
    const tourist = await Tourist.findById(userId);
    console.log(req.user);
    if (!tourist) {
      return res.status(403).json({ message: "Tourist not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update tourist profile
exports.updateTouristProfile = async (req, res) => {
  const { mobileNumber, nationality, dob, occupation, wallet } = req.body; // Add any other fields you want to update

  try {
    const userId = req.user._id;
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update fields
    if (mobileNumber) tourist.mobileNumber = mobileNumber;
    if (nationality) tourist.nationality = nationality;
    if (dob) tourist.dob = dob;
    if (occupation) tourist.occupation = occupation;
    if (wallet) tourist.wallet = { ...tourist.wallet, ...wallet }; // Updating wallet

    await tourist.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: tourist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTouristID = async (req, res) => {
  try {
    const userId = req.user._id;
    const tourist = await Tourist.findById(userId).populate(
      "activities attractions itineraries"
    );
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ userId: tourist._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.buyProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Assuming you have a product ID in the request body
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity required" });
    }

    // Assuming you have a Product model
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }

    tourist.products.push(productId); // Add the product to the tourist's list of products
    await tourist.save();

    // Update the product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(200).json({ message: "Product bought successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTouristProductHistory = async (req, res) => {
  user = req.user;
  try {
    const tourist = await Tourist.findById(user._id).populate("products");
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ products: tourist.products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.TouristReviewProduct = async (req, res) => {
  try {
    // Ensure the necessary data is provided in the request body
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new review
    const user = req.user._id;
    const review = new Review({
      rating,
      comment,
      product: productId,
      user,
    });

    // Save the review
    await review.save();

    // Find the product and add the review ID to the reviews array
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.reviews.push(review._id); // Add the review ID to the product's reviews array
    await product.save(); // Save the updated product

    // Recalculate and save the new average rating for the product
    await product.calculateAverageRating();

    // Send success response
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);

    // Send error response based on error type
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error", details: error.errors });
    } else if (error.name === "MongoError") {
      return res
        .status(500)
        .json({ message: "Database error", details: error.message });
    } else {
      return res
        .status(500)
        .json({ message: "Internal server error", details: error.message });
    }
  }
};

exports.TouristBookActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const activityId = req.body.activityId;

    // Find the tourist by ID
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the activity by ID
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if the activity is already booked
    if (tourist.activities.includes(activityId)) {
      return res.status(400).json({ message: "Activity already booked" });
    }

    // Add the activity ID to the list
    tourist.activities.push(activityId);

    // Save the updated tourist data
    await tourist.save();
    res.status(200).json({ message: "Activity booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.TouristBookAttraction = async (req, res) => {
  try {
    const userId = req.user._id;
    const attractionId = req.body.attractionId;

    // Find the tourist by ID
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the attraction by ID
    const attraction = await Attraction.findById(attractionId);
    if (!attraction) {
      return res.status(404).json({ message: "Attraction not found" });
    }

    // Check if the attraction is already booked
    if (tourist.attractions.includes(attractionId)) {
      return res.status(400).json({ message: "Attraction already booked" });
    }

    // Add the attraction ID to the list
    tourist.attractions.push(attractionId);

    // Save the updated tourist data
    await tourist.save();
    res.status(200).json({ message: "Attraction booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.TouristBookItinerary = async (req, res) => {
  try {
    const userId = req.user._id;
    const itineraryId = req.body.itineraryId;

    // Find the tourist by ID
    const tourist = await Tourist.findById(userId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if the itinerary is already booked
    if (tourist.itineraries.includes(itineraryId)) {
      return res.status(400).json({ message: "Itinerary already booked" });
    }

    // Add the itinerary ID to the list
    tourist.itineraries.push(itineraryId);

    // Save the updated tourist data
    await tourist.save();

    res.status(200).json({ message: "Itinerary booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTouristData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Populate the related documents including advertiserId, tourGuideId, governorId, etc.
    const tourist = await Tourist.findById(userId)
      // Populate activities with the entire document (including advertiserId)
      .populate({
        path: "activities", // Populating activities with advertiserId inside activity document
        populate: { path: "advertiserId category preferenceTag" },
      })
      .populate({
        path: "attractions", // Populating attractions with governorId inside attraction document
        populate: { path: "governorId" },
      })
      .populate({
        path: "itineraries", // Populating attractions with governorId inside attraction document
        populate: { path: "tourGuideId" },
      });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    console.log(tourist); // Optional, for debugging
    res.status(200).json({ tourist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCompletedItineraries = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the tourist by ID and populate itineraries with tourGuideId
    const tourist = await Tourist.findById(userId).populate({
      path: "itineraries",
      populate: {
        path: "tourGuideId", // Populate the tourGuideId within each itinerary
        model: "User", // Ensure this matches your actual model name for Tour Guides
      },
    });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Get the current date
    const currentDate = new Date();

    // Filter out completed itineraries where all available dates are in the past
    const completedItineraries = tourist.itineraries.filter((itinerary) =>
      itinerary.availableDates.every((date) => new Date(date) < currentDate)
    );

    res.status(200).json({ completedItineraries });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getCompletedActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the tourist by ID and populate activities with advertiserId
    const tourist = await Tourist.findById(userId).populate({
      path: "activities",
      populate: {
        path: "advertiserId", // Populate the advertiserId within each activity
        model: "User", // Ensure this matches your actual model name for Advertisers
      },
    });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Get the current date
    const currentDate = new Date();

    // Filter out completed activities where the activity date is in the past
    const completedActivities = tourist.activities.filter(
      (activity) => new Date(activity.date) < currentDate
    );

    res.status(200).json({ completedActivities });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.reviewTourGuide = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const tourGuideId = req.params.id; // Assuming the tour guide ID is passed in the route parameters
    const userId = req.user._id; // Assuming user is authenticated and `req.user` is populated

    // Find the TourGuideProfile and populate `userId` within `ratings`
    const currGuide = await TourGuide.findById(tourGuideId);

    if (!currGuide) {
      return res.status(404).json({ message: "Tour Guide not found." });
    }

    // Add the new rating to the ratings array
    currGuide.ratings.push({ userId, rating, comment });
    await currGuide.save();

    // Populate `userId` field after saving (populate can be done here on-the-fly)
    await currGuide.populate({
      path: "ratings.userId",
      select: "email username", // Fetching the email and username of the user who left the rating
    });

    res.status(200).json({
      message: "Rating and comment added successfully!",
      currGuide,
    });
  } catch (error) {
    console.error("Error adding rating and comment:", error.message);
    res.status(400).json({ error: error.message });
  }
};
