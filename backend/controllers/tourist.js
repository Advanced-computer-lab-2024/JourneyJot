/** @format */
const Tourist = require('../models/Tourist');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');
const Attraction = require('../models/Attraction');
const TourGuide = require('../models/Tour-Guide');
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
		const userId = req.user._id; // Assuming you're using a middleware to attach user info to req.user
		const tourist = await Tourist.findById(userId);
		console.log(req.user);
		if (!tourist) {
			return res.status(403).json({ message: 'Tourist not found' });
		}

		res.status(200).json({ profile: tourist });
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

		// Extract product ID and quantity from the request body
		const { productId, quantity } = req.body;
		if (!productId || !quantity) {
			return res
				.status(400)
				.json({ message: 'Product ID and quantity required' });
		}

		// Find the product by ID
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		// Check if the requested quantity is available
		if (product.quantity < quantity) {
			return res.status(400).json({ message: 'Insufficient quantity' });
		}

		// Calculate the total cost of the product based on quantity
		const totalCost = product.price * quantity;

		// Check if the tourist has enough balance in the wallet
		if (tourist.wallet.balance < totalCost) {
			return res.status(400).json({ message: 'Insufficient wallet balance' });
		}

		// Deduct the total cost from the wallet balance
		tourist.wallet.balance -= totalCost;

		// Calculate points based on tourist level and total cost
		let pointsMultiplier = 0.5; // Default multiplier for level 1
		if (tourist.points >= 100000) pointsMultiplier = 1; // Level 2
		if (tourist.points >= 500000) pointsMultiplier = 1.5; // Level 3
		const pointsEarned = totalCost * pointsMultiplier;
		tourist.points += pointsEarned;

		// Add the product to the tourist's list of products
		tourist.products.push(productId);

		// Save changes to the tourist
		await tourist.save();

		// Update the product quantity
		product.quantity -= quantity;
		await product.save();

		// Log to confirm all values before sending the response
		console.log({
			message: 'Product bought successfully',
			product: {
				id: product._id,
				name: product.name,
				price: product.price,
				requestedQuantity: quantity,
				remainingQuantity: product.quantity,
			},
			transactionDetails: {
				totalCost: totalCost.toFixed(2),
				updatedWalletBalance: tourist.wallet.balance.toFixed(2),
				pointsEarned: Math.floor(pointsEarned),
				totalPoints: Math.floor(tourist.points),
			},
		});

		// Respond with detailed transaction information
		res.status(200).json({
			message: 'Product bought successfully',
			product: {
				id: product._id,
				name: product.name,
				price: product.price,
				requestedQuantity: quantity,
				remainingQuantity: product.quantity,
			},
			transactionDetails: {
				totalCost: totalCost.toFixed(2),
				updatedWalletBalance: tourist.wallet.balance.toFixed(2),
				pointsEarned: Math.floor(pointsEarned),
				totalPoints: Math.floor(tourist.points),
			},
		});
	} catch (error) {
		console.error('Error buying product:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getTouristProductHistory = async (req, res) => {
	const user = req.user._id;

	try {
		const tourist = await Tourist.findById(user).populate('products');
		// const tourist = await Tourist.findById(user).populate({
		// 	path: 'products._id', // Specify the path to populate
		// 	model: 'Product',
		// 	select: 'name',
		// });
		// const tourist = await Tourist.findById(user).populate('products');

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		console.log(JSON.stringify(tourist.products, null, 2)); // Check populated data
		res.status(200).json({ products: tourist.products });
	} catch (error) {
		console.error(error);
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

		// Find the tourist and activity
		const tourist = await Tourist.findById(userId);
		const activity = await Activity.findById(activityId).populate(
			'category preferenceTag'
		);

		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
		if (!activity)
			return res.status(404).json({ message: 'Activity not found' });

		// Check if activity is already booked by the tourist
		if (tourist.activities.includes(activityId)) {
			return res
				.status(400)
				.json({ message: 'Activity has already been booked' });
		}

		// Check balance and deduct price
		if (tourist.wallet.balance < activity.price) {
			return res.status(400).json({ message: 'Insufficient wallet balance' });
		}
		tourist.wallet.balance -= activity.price;

		// Calculate and add points
		let pointsMultiplier =
			tourist.points >= 500000 ? 1.5 : tourist.points >= 100000 ? 1 : 0.5;
		const pointsEarned = activity.price * pointsMultiplier;
		tourist.points += pointsEarned;

		// Add activity to tourist's bookings
		tourist.activities.push(activityId);
		await tourist.save();

		// Send response
		res.status(200).json({
			message: 'Activity booked successfully',
			activity,
			updatedWalletBalance: tourist.wallet.balance.toFixed(2),
			pointsEarned: Math.floor(pointsEarned),
			totalPoints: Math.floor(tourist.points),
		});
	} catch (error) {
		console.error('Error booking activity:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.TouristBookAttraction = async (req, res) => {
	try {
		const userId = req.user._id;
		const attractionId = req.body.attractionId;
		const ticketType = req.body.ticketType; // e.g., 'native', 'foreigner', 'student'

		// Find the tourist and attraction
		const tourist = await Tourist.findById(userId);
		const attraction = await Attraction.findById(attractionId);

		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
		if (!attraction)
			return res.status(404).json({ message: 'Attraction not found' });
		if (tourist.attractions.includes(attractionId)) {
			return res
				.status(400)
				.json({ message: 'Attraction has already been booked' });
		}

		// Validate the ticket type and get the appropriate price
		const ticketPrice = attraction.ticketPrices[ticketType];
		if (ticketPrice === undefined) {
			return res
				.status(400)
				.json({ message: 'Invalid or unavailable ticket type' });
		}

		// Check balance and deduct price
		if (tourist.wallet.balance < ticketPrice) {
			return res.status(400).json({ message: 'Insufficient wallet balance' });
		}
		tourist.wallet.balance -= ticketPrice;

		// Calculate and add points
		let pointsMultiplier =
			tourist.points >= 500000 ? 1.5 : tourist.points >= 100000 ? 1 : 0.5;
		const pointsEarned = ticketPrice * pointsMultiplier;
		tourist.points += pointsEarned;

		// Add attraction to tourist's bookings
		tourist.attractions.push(attractionId);
		await tourist.save();

		// Send response
		res.status(200).json({
			message: 'Attraction booked successfully',
			attraction,
			ticketType,
			ticketPrice: ticketPrice.toFixed(2),
			updatedWalletBalance: tourist.wallet.balance.toFixed(2),
			pointsEarned: Math.floor(pointsEarned),
			totalPoints: Math.floor(tourist.points),
		});
	} catch (error) {
		console.error('Error booking attraction:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.TouristBookItinerary = async (req, res) => {
	try {
		const userId = req.user._id;
		const itineraryId = req.body.itineraryId;

		// Find the tourist and itinerary
		const tourist = await Tourist.findById(userId);
		const itinerary = await Itinerary.findById(itineraryId);

		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
		if (!itinerary)
			return res.status(404).json({ message: 'Itinerary not found' });
		if (tourist.itineraries.includes(itineraryId)) {
			return res
				.status(400)
				.json({ message: 'Itinerary has already been booked' });
		}

		// Check balance and deduct price
		if (tourist.wallet.balance < itinerary.price) {
			return res.status(400).json({ message: 'Insufficient wallet balance' });
		}
		tourist.wallet.balance -= itinerary.price;

		// Calculate and add points
		let pointsMultiplier =
			tourist.points >= 500000 ? 1.5 : tourist.points >= 100000 ? 1 : 0.5;
		const pointsEarned = itinerary.price * pointsMultiplier;
		tourist.points += pointsEarned;

		// Add itinerary to tourist's bookings
		tourist.itineraries.push(itineraryId);
		await tourist.save();

		// Send response
		res.status(200).json({
			message: 'Itinerary booked successfully',
			itinerary,
			updatedWalletBalance: tourist.wallet.balance.toFixed(2),
			pointsEarned: Math.floor(pointsEarned),
			totalPoints: Math.floor(tourist.points),
		});
	} catch (error) {
		console.error('Error booking itinerary:', error);
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

exports.getCompletedItineraries = async (req, res) => {
	try {
		const userId = req.user._id;

		// Find the tourist by ID and populate itineraries with tourGuideId
		const tourist = await Tourist.findById(userId).populate({
			path: 'itineraries',
			populate: {
				path: 'tourGuideId', // Populate the tourGuideId within each itinerary
				model: 'User', // Ensure this matches your actual model name for Tour Guides
			},
		});

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Get the current date
		const currentDate = new Date();

		// Filter out completed itineraries where all available dates are in the past
		const completedItineraries = tourist.itineraries.filter((itinerary) =>
			itinerary.availableDates.every((date) => new Date(date) < currentDate)
		);

		res.status(200).json({ completedItineraries });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getCompletedActivities = async (req, res) => {
	try {
		const userId = req.user._id;

		// Find the tourist by ID and populate activities with advertiserId
		const tourist = await Tourist.findById(userId).populate({
			path: 'activities',
			populate: {
				path: 'advertiserId', // Populate the advertiserId within each activity
				model: 'User', // Ensure this matches your actual model name for Advertisers
			},
		});

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Get the current date
		const currentDate = new Date();

		// Filter out completed activities where the activity date is in the past
		const completedActivities = tourist.activities.filter(
			(activity) => new Date(activity.date) < currentDate
		);

		res.status(200).json({ completedActivities });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
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
			return res.status(404).json({ message: 'Tour Guide not found.' });
		}

		// Add the new rating to the ratings array
		currGuide.ratings.push({ userId, rating, comment });
		await currGuide.save();

		// Populate `userId` field after saving (populate can be done here on-the-fly)
		await currGuide.populate({
			path: 'ratings.userId',
			select: 'email username', // Fetching the email and username of the user who left the rating
		});

		res.status(200).json({
			message: 'Rating and comment added successfully!',
			currGuide,
		});
	} catch (error) {
		console.error('Error adding rating and comment:', error.message);
		res.status(400).json({ error: error.message });
	}
};

exports.getTouristPoints = async (req, res) => {
	try {
		const userId = req.user._id;
		const tourist = await Tourist.findById(userId);

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json({
			points: tourist.points,
			level: tourist.level,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.updateTouristPoints = async (req, res) => {
	try {
		const userId = req.user._id;
		const { points } = req.body; // Positive number to add points, negative to subtract

		if (!points) {
			return res.status(400).json({ message: 'Points value is required' });
		}

		// Find the tourist and determine their level
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Determine the multiplier based on the tourist's points level
		let multiplier;
		if (tourist.points > 500000) {
			multiplier = 1.5; // Level 3
		} else if (tourist.points > 100000) {
			multiplier = 1; // Level 2
		} else {
			multiplier = 0.5; // Level 1
		}

		// Apply multiplier to the points
		const adjustedPoints = points * multiplier;
		tourist.points += adjustedPoints; // Add or subtract the adjusted points
		await tourist.save();

		res.status(200).json({
			message: 'Points updated successfully',
			points: tourist.points,
			pointsAdded: adjustedPoints, // Return the adjusted points added for transparency
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getWalletBalance = async (req, res) => {
	try {
		const userId = req.user._id; // Assuming `user` is set by an auth middleware

		// Find the tourist by ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Return the wallet balance
		res.status(200).json({ walletBalance: tourist.wallet.balance });
	} catch (error) {
		console.error('Error fetching wallet balance:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// In touristController.js

exports.addFundsToWallet = async (req, res) => {
	try {
		const userId = req.user._id;
		const addAmount = 1000; // Amount to add to wallet balance

		// Find the tourist by ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Add funds to wallet balance
		tourist.wallet.balance += addAmount;
		await tourist.save();

		res.status(200).json({
			message: 'Funds added successfully',
			newBalance: tourist.wallet.balance,
		});
	} catch (error) {
		console.error('Error adding funds:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// In controllers/tourist.js

exports.redeemPointsToWallet = async (req, res) => {
	try {
		const userId = req.user._id;
		const pointsToCashRate = 0.01; // 10,000 points = 100 EGP, so 1 point = 0.01 EGP

		// Find the tourist by ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Calculate EGP equivalent and deduct points
		const redeemableAmount = tourist.points * pointsToCashRate;
		tourist.wallet.balance += redeemableAmount;
		tourist.points = 0; // Reset points to zero after redemption

		// Save the updated tourist data
		await tourist.save();

		res.status(200).json({
			message: 'Points redeemed successfully',
			newWalletBalance: tourist.wallet.balance,
			remainingPoints: tourist.points,
		});
	} catch (error) {
		console.error('Error redeeming points:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.requestAccountDeletion = async (req, res) => {
	try {
		const touristId = req.user._id; // Assumes user is authenticated and tourist ID is available

		// Find the tourist by ID
		const tourist = await Tourist.findById(touristId);

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Check if there are any itineraries
		if (tourist.itineraries && tourist.itineraries.length > 0) {
			return res.status(400).json({
				message: 'Account cannot be deleted. You have associated itineraries.',
			});
		}

		// Check if there are any activities
		if (tourist.activities && tourist.activities.length > 0) {
			return res.status(400).json({
				message: 'Account cannot be deleted. You have associated activities.',
			});
		}

		// Check if there are any attractions
		if (tourist.attractions && tourist.attractions.length > 0) {
			return res.status(400).json({
				message: 'Account cannot be deleted. You have associated attractions.',
			});
		}

		// If all arrays are empty, proceed
		await Tourist.findByIdAndUpdate(touristId);

		res.status(200).json({
			message: 'Request Logic !!',
		});
	} catch (error) {
		console.error('Error deleting account:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.cancelActivity = async (req, res) => {
	try {
		const userId = req.user._id;
		const { activityId } = req.params;

		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		const activityIndex = tourist.activities.indexOf(activityId);
		if (activityIndex === -1) {
			return res
				.status(400)
				.json({ message: 'Activity not found in reservations' });
		}

		tourist.activities.splice(activityIndex, 1);
		await tourist.save();

		res.status(200).json({ message: 'Activity cancelled successfully' });
	} catch (error) {
		console.error('Error canceling activity:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.cancelItinerary = async (req, res) => {
	try {
		const userId = req.user._id;
		const { itineraryId } = req.params;

		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		const itineraryIndex = tourist.itineraries.indexOf(itineraryId);
		if (itineraryIndex === -1) {
			return res
				.status(400)
				.json({ message: 'Itinerary not found in reservations' });
		}

		tourist.itineraries.splice(itineraryIndex, 1);
		await tourist.save();

		res.status(200).json({ message: 'Itinerary cancelled successfully' });
	} catch (error) {
		console.error('Error canceling itinerary:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.cancelAttraction = async (req, res) => {
	try {
		const userId = req.user._id;
		const { attractionId } = req.params;

		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		const attractionIndex = tourist.attractions.indexOf(attractionId);
		if (attractionIndex === -1) {
			return res
				.status(400)
				.json({ message: 'Attraction not found in reservations' });
		}

		tourist.attractions.splice(attractionIndex, 1);
		await tourist.save();

		res.status(200).json({ message: 'Attraction cancelled successfully' });
	} catch (error) {
		console.error('Error canceling attraction:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
