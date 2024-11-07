/** @format */
const Tourist = require('../models/Tourist');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');
const Attraction = require('../models/Attraction');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
		return res.status(400).json({ message: 'All fields are required' });
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
					.json({ message: 'User created successfully', user: result });
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
					.json({ message: 'Auth failed username does not exist' });
			}
			bcrypt.compare(req.body.password, tourist[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({ message: 'Auth failed' });
				} else if (result) {
					jwt.sign(
						{ username: tourist[0].username, _id: tourist[0]._id },
						'cr7',
						{
							expiresIn: '12h',
						},
						(errors, results) => {
							if (errors) {
								return res.status(500).json({ error: errors.message });
							}
							return res.status(200).json({
								message: 'Authentication successful',
								token: results,
							});
						}
					);
				} else {
					return res
						.status(401)
						.json({ message: 'Auth failed incorrect password' });
				}
			});
		})
		.catch((error) => {
			console.log('Error finding user:', error);
			return res.status(401).json({ message: 'Authentication failed' });
		});
};

// Get tourist profile
exports.getTouristProfile = async (req, res) => {
	try {
		const userId = req.user._id;
		// Find the tourist and populate activities with advertiser, category, and preferenceTag fields
		const tourist = await Tourist.findById(userId).populate(
			'category preferenceTag'
		);

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json({ tourist });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// Update tourist profile
exports.updateTouristProfile = async (req, res) => {
	const { mobileNumber, nationality, dob, occupation, wallet } = req.body; // Add any other fields you want to update

	try {
		const userId = req.user._id;
		const tourist = await Tourist.findById(userId).populate(
			'category preferenceTag'
		);

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Update fields
		if (mobileNumber) tourist.mobileNumber = mobileNumber;
		if (nationality) tourist.nationality = nationality;
		if (dob) tourist.dob = dob;
		if (occupation) tourist.occupation = occupation;
		if (wallet) tourist.wallet = { ...tourist.wallet, ...wallet }; // Updating wallet

		await tourist.save();

		res.status(200).json({
			message: 'Profile updated successfully',
			profile: tourist,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getTouristID = async (req, res) => {
	try {
		const userId = req.user._id;
		const tourist = await Tourist.findById(userId).populate(
			'activities attractions itineraries'
		);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json({ userId: tourist._id });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.buyProduct = async (req, res) => {
	try {
		const userId = req.user._id;
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Assuming you have a product ID in the request body
		const { productId, quantity } = req.body;
		if (!productId || !quantity) {
			return res
				.status(400)
				.json({ message: 'Product ID and quantity required' });
		}

		// Assuming you have a Product model
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		if (product.quantity < quantity) {
			return res.status(400).json({ message: 'Insufficient quantity' });
		}

		tourist.products.push(productId); // Add the product to the tourist's list of products
		await tourist.save();

		// Update the product quantity
		product.quantity -= quantity;
		await product.save();

		res.status(200).json({ message: 'Product bought successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getTouristProductHistory = async (req, res) => {
	user = req.user;
	try {
		const tourist = await Tourist.findById(user._id).populate('products');
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json({ products: tourist.products });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.TouristReviewProduct = async (req, res) => {
	try {
		// Ensure the necessary data is provided in the request body
		const { productId, rating, comment } = req.body;
		if (!productId || !rating || !comment) {
			return res.status(400).json({ message: 'Missing required fields' });
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
			return res.status(404).json({ message: 'Product not found' });
		}

		product.reviews.push(review._id); // Add the review ID to the product's reviews array
		await product.save(); // Save the updated product

		// Recalculate and save the new average rating for the product
		await product.calculateAverageRating();

		// Send success response
		res.status(201).json({ message: 'Review added successfully', review });
	} catch (error) {
		console.error('Error creating review:', error);

		// Send error response based on error type
		if (error.name === 'ValidationError') {
			return res
				.status(400)
				.json({ message: 'Validation error', details: error.errors });
		} else if (error.name === 'MongoError') {
			return res
				.status(500)
				.json({ message: 'Database error', details: error.message });
		} else {
			return res
				.status(500)
				.json({ message: 'Internal server error', details: error.message });
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
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Find the activity by ID and populate required fields
		const activity = await Activity.findById(activityId).populate(
			'category preferenceTag'
		);
		// Ensure field names are correct
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}

		tourist.activities.push(activityId);
		await tourist.save();

		// Send populated data to the frontend
		res.status(200).json({
			message: 'Activity booked successfully',
			activity, // Include populated activity details
			tourist, // Include updated tourist details if needed on frontend
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.TouristBookAttraction = async (req, res) => {
	try {
		const userId = req.user._id;
		const attractionId = req.body.attractionId;

		// Find the tourist by ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Find the attraction by ID to get the price
		const attraction = await Attraction.findById(attractionId);
		if (!attraction) {
			return res.status(404).json({ message: 'Attraction not found' });
		}

		tourist.attractions.push(attractionId);

		// Save the updated tourist data
		await tourist.save();

		res.status(200).json({ message: 'Attraction booked successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.TouristBookItinerary = async (req, res) => {
	try {
		const userId = req.user._id;
		const itineraryId = req.body.itineraryId;

		// Find the tourist by ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Find the itinerary by ID to get the price
		const itinerary = await Itinerary.findById(itineraryId);
		if (!itinerary) {
			return res.status(404).json({ message: 'Itinerary not found' });
		}
		tourist.itineraries.push(itineraryId);

		// Save the updated tourist data
		await tourist.save();

		res.status(200).json({ message: 'Itinerary booked successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getTouristData = async (req, res) => {
	try {
		const userId = req.user._id;

		// Populate the related documents including advertiserId, tourGuideId, governorId, etc.
		const tourist = await Tourist.findById(userId)
			.populate({
				path: 'activities', // Populating activities with advertiserId inside activity document
				populate: { path: 'advertiserId' },
			})
			.populate({
				path: 'attractions', // Populating attractions with governorId inside attraction document
				populate: { path: 'governorId' },
			})
			.populate({
				path: 'itineraries', // Populating attractions with governorId inside attraction document
				populate: { path: 'tourGuideId' },
			});

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		console.log(tourist); // Optional, for debugging
		res.status(200).json({ tourist });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};
