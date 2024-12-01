/** @format */
require('dotenv').config();
const Tourist = require('../models/Tourist');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Activity = require('../models/Activity');
const Itinerary = require('../models/Itinerary');
const Attraction = require('../models/Attraction');
const TourGuide = require('../models/Tour-Guide');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Transportation = require('../models/Transportation');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const sendReceiptEmail = async (touristEmail, bookingDetails) => {
	const mailOptions = {
		from: 'your-email@example.com', // Replace with your email
		to: touristEmail,
		subject: 'Your Payment Receipt for Booking',
		html: `
		<h2>Payment Receipt</h2>
		<p>Thank you for booking with us!</p>
		<p><strong>Booking Details:</strong></p>
		<p>Activity: ${
			bookingDetails.activityName ||
			bookingDetails.itineraryName ||
			bookingDetails.attractionName ||
			'N/A'
		}</p>
		<p>Price: $${bookingDetails.price.toFixed(2)}</p>
		<p>Points Earned: ${Math.floor(bookingDetails.pointsEarned)}</p>
		<p>Total Points: ${Math.floor(bookingDetails.totalPoints)}</p>
		<p>Remaining Wallet Balance: $${
			isNaN(bookingDetails.updatedWalletBalance) ||
			bookingDetails.updatedWalletBalance === null
				? '0.00'
				: Number(bookingDetails.updatedWalletBalance).toFixed(2)
		}</p>
		<p>We hope you enjoy your experience!</p>
	  `,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error('Error sending email:', error);
	}
};

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
					.json({ message: 'Auth failed: username does not exist' });
			}
			bcrypt.compare(req.body.password, tourist[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({ message: 'Auth failed' });
				} else if (result) {
					// Add role to the JWT payload
					jwt.sign(
						{
							username: tourist[0].username,
							_id: tourist[0]._id,
							role: tourist[0].role, // Add the role here
						},
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
						.json({ message: 'Auth failed: incorrect password' });
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
		const tourist = await Tourist.findById(userId).populate();

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
		const product = await Product.findById(productId).populate('isBooked');
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
		product.isBooked = true;
		await product.save();
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
		const activity = await Activity.findById(activityId)
			.populate(
				'category preferenceTag isBooked ratings.userId' // Include isBooked in the populated fields
			)
			.populate({
				path: 'tourists',
				select: 'username', // Fetching the email and username of the user who left the rating
			});

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

		// Update the isBooked attribute of the activity
		activity.isBooked = true;
		await activity.save();
		await tourist.save();

		// Send email receipt
		sendReceiptEmail(tourist.email, {
			activityName: activity.name,
			price: activity.price,
			pointsEarned,
			totalPoints: tourist.points,
			updatedWalletBalance: tourist.wallet.balance.toFixed(2),
		});
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
		const attraction = await Attraction.findById(attractionId).populate(
			'isBooked'
		);

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
		attraction.isBooked = true;

		await attraction.save(); // Save the updated attraction object
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
		const itinerary = await Itinerary.findById(itineraryId).populate(
			'isBooked'
		);

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
		itinerary.isBooked = true;
		await itinerary.save(); // Save the updated itinerary object
		await tourist.save();
		// Send email receipt
		sendReceiptEmail(tourist.email, {
			itineraryName:
				itinerary.tag || itinerary.name || itinerary.locations || 'N/A', // Ensure proper fallback
			price: itinerary.price,
			pointsEarned: pointsEarned,
			totalPoints: tourist.points,
			updatedWalletBalance: tourist.wallet.balance.toFixed(2),
		});
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
		// Get the current date
		const currentDate = new Date();

		// Find all tourists and populate their itineraries
		const tourists = await Tourist.find().populate({
			path: 'itineraries',
			populate: {
				path: 'tourGuideId', // Populate the tourGuideId within each itinerary
				model: 'User', // Ensure this matches your actual model name for Tour Guides
			},
		});

		if (!tourists || tourists.length === 0) {
			return res.status(404).json({ message: 'No tourists found' });
		}

		// Create a set to track unique tourists with completed itineraries
		const uniqueTouristDetails = new Map(); // Use a Map to store both ID and username

		// Array to collect all completed itineraries
		const allCompletedItineraries = [];

		// Iterate through all tourists and their itineraries
		tourists.forEach((tourist) => {
			const completedItineraries = tourist.itineraries.filter((itinerary) =>
				itinerary.availableDates.every((date) => new Date(date) < currentDate)
			);

			// If the tourist has completed itineraries, add their ID and username to the map
			if (completedItineraries.length > 0) {
				uniqueTouristDetails.set(tourist._id.toString(), tourist.username);
			}

			// Add the completed itineraries to the main array
			allCompletedItineraries.push(...completedItineraries);
		});

		// Count the number of unique tourists
		const distinctTouristCount = uniqueTouristDetails.size;

		// Convert the Map to an array for easier processing
		const distinctTourists = Array.from(
			uniqueTouristDetails,
			([id, username]) => ({
				id,
				username,
			})
		);

		// Return both the count, the usernames, and the list of completed itineraries
		res.status(200).json({
			distinctTouristCount,
			distinctTourists,
			completedItineraries: allCompletedItineraries,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getCompletedItinerariesAndTourists = async (req, res) => {
	try {
		// Get query parameters for month and year
		const { month, year } = req.query;

		// Parse month and year
		const filterMonth = parseInt(month, 10);
		const filterYear = parseInt(year, 10);

		// Validate inputs
		if (
			isNaN(filterMonth) ||
			isNaN(filterYear) ||
			filterMonth < 1 ||
			filterMonth > 12
		) {
			return res
				.status(400)
				.json({ message: 'Invalid month or year provided' });
		}

		// Create date range for the specified month and year
		const startDate = new Date(filterYear, filterMonth - 1, 1); // Start of the month
		const endDate = new Date(filterYear, filterMonth, 0, 23, 59, 59); // End of the month

		// Find all tourists and populate their itineraries
		const tourists = await Tourist.find().populate({
			path: 'itineraries',
			populate: {
				path: 'tourGuideId', // Populate the tourGuideId within each itinerary
				model: 'User', // Ensure this matches your actual model name for Tour Guides
			},
		});

		if (!tourists || tourists.length === 0) {
			return res.status(404).json({ message: 'No tourists found' });
		}

		// Create a set to track unique tourists with completed itineraries
		const uniqueTouristDetails = new Map(); // Use a Map to store both ID and username

		// Array to collect all completed itineraries
		const filteredCompletedItineraries = [];

		// Iterate through all tourists and their itineraries
		tourists.forEach((tourist) => {
			// Filter completed itineraries within the specified date range
			const completedItineraries = tourist.itineraries.filter((itinerary) =>
				itinerary.availableDates.every((date) => {
					const itineraryDate = new Date(date);
					return (
						itineraryDate < new Date() && // Completed
						itineraryDate >= startDate && // After start of month
						itineraryDate <= endDate // Before end of month
					);
				})
			);

			// If the tourist has completed itineraries, add their ID and username to the map
			if (completedItineraries.length > 0) {
				uniqueTouristDetails.set(tourist._id.toString(), tourist.username);
			}

			// Add the filtered itineraries to the main array
			filteredCompletedItineraries.push(...completedItineraries);
		});

		// Count the number of unique tourists
		const distinctTouristCount = uniqueTouristDetails.size;

		// Convert the Map to an array for easier processing
		const distinctTourists = Array.from(
			uniqueTouristDetails,
			([id, username]) => ({
				id,
				username,
			})
		);

		// Return both the count, the usernames, and the list of completed itineraries
		res.status(200).json({
			distinctTouristCount,
			distinctTourists,
			completedItineraries: filteredCompletedItineraries,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};
exports.getCompletedActivities = async (req, res) => {
	try {
		// Get the current date
		const currentDate = new Date();

		// Find all tourists and populate their activities
		const tourists = await Tourist.find().populate({
			path: 'activities',
			populate: {
				path: 'advertiserId', // Populate the advertiserId within each activity
				model: 'User', // Ensure this matches your actual model name for Advertisers
			},
		});

		if (!tourists || tourists.length === 0) {
			return res.status(404).json({ message: 'No tourists found' });
		}

		// Create a set to track unique tourists with completed activities
		const uniqueTouristDetails = new Map(); // Use a Map to store both ID and username

		// Array to collect all completed activities
		const allCompletedActivities = [];

		// Iterate through all tourists and their activities
		tourists.forEach((tourist) => {
			const completedActivities = tourist.activities.filter(
				(activity) => new Date(activity.date) < currentDate
			);

			// If the tourist has completed activities, add their ID and username to the map
			if (completedActivities.length > 0) {
				uniqueTouristDetails.set(tourist._id.toString(), tourist.username);
			}

			// Add the completed activities to the main array
			allCompletedActivities.push(...completedActivities);
		});

		// Count the number of unique tourists
		const distinctTouristCount = uniqueTouristDetails.size;

		// Convert the Map to an array for easier processing
		const distinctTourists = Array.from(
			uniqueTouristDetails,
			([id, username]) => ({
				id,
				username,
			})
		);

		// Return both the count, the usernames, and the list of completed activities
		res.status(200).json({
			distinctTouristCount,
			distinctTourists,
			completedActivities: allCompletedActivities,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.getCompletedActivitiesAndTourists = async (req, res) => {
	try {
		// Get the current date
		const currentDate = new Date();

		// Extract the month and year from the request (e.g., { month: 11, year: 2024 })
		const { month, year } = req.query;

		if (!month || !year) {
			return res
				.status(400)
				.json({ message: 'Month and year are required for filtering' });
		}

		// Find all tourists and populate their activities
		const tourists = await Tourist.find().populate({
			path: 'activities',
			populate: {
				path: 'advertiserId', // Populate the advertiserId within each activity
				model: 'User', // Ensure this matches your actual model name for Advertisers
			},
		});

		if (!tourists || tourists.length === 0) {
			return res.status(404).json({ message: 'No tourists found' });
		}

		// Create a set to track unique tourists with completed activities
		const uniqueTouristDetails = new Map(); // Use a Map to store both ID and username

		// Array to collect all completed activities
		const allCompletedActivities = [];

		// Iterate through all tourists and their activities
		tourists.forEach((tourist) => {
			const completedActivities = tourist.activities.filter((activity) => {
				const activityDate = new Date(activity.date);

				// Filter by completed activities and the given month and year
				return (
					activityDate < currentDate &&
					activityDate.getMonth() + 1 === parseInt(month) && // Month is 0-indexed
					activityDate.getFullYear() === parseInt(year)
				);
			});

			// If the tourist has completed activities, add their ID and username to the map
			if (completedActivities.length > 0) {
				uniqueTouristDetails.set(tourist._id.toString(), tourist.username);
			}

			// Add the completed activities to the main array
			allCompletedActivities.push(...completedActivities);
		});

		// Count the number of unique tourists
		const distinctTouristCount = uniqueTouristDetails.size;

		// Convert the Map to an array for easier processing
		const distinctTourists = Array.from(
			uniqueTouristDetails,
			([id, username]) => ({
				id,
				username,
			})
		);

		// Return both the count, the usernames, and the list of completed activities
		res.status(200).json({
			distinctTouristCount,
			distinctTourists,
			completedActivities: allCompletedActivities,
		});
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
		await Tourist.findByIdAndUpdate(touristId, { status: 'pending_deletion' });

		res.status(200).json({
			message: 'Request Logic !! Account will be deleted',
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
		const activity = await Activity.findById(activityId);

		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
		if (!activity)
			return res.status(404).json({ message: 'Activity not found' });

		const activityIndex = tourist.activities.indexOf(activityId);
		if (activityIndex === -1) {
			return res
				.status(400)
				.json({ message: 'Activity not found in reservations' });
		}

		// Refund activity price
		tourist.wallet.balance += activity.price;

		// Remove activity from bookings
		tourist.activities.splice(activityIndex, 1);

		await tourist.save();

		res.status(200).json({
			message: 'Activity cancelled successfully',
			refundedAmount: activity.price.toFixed(2),
			newBalance: tourist.wallet.balance.toFixed(2),
		});
	} catch (error) {
		console.error('Error canceling activity:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.cancelItinerary = async (req, res) => {
	try {
		const userId = req.user._id;
		const { itineraryId } = req.params;

		const tourist = await Tourist.findById(userId);
		const itinerary = await Itinerary.findById(itineraryId);

		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
		if (!itinerary)
			return res.status(404).json({ message: 'Itinerary not found' });

		const itineraryIndex = tourist.itineraries.indexOf(itineraryId);
		if (itineraryIndex === -1) {
			return res
				.status(400)
				.json({ message: 'Itinerary not found in reservations' });
		}

		// Refund itinerary price
		tourist.wallet.balance += itinerary.price;

		// Remove itinerary from bookings
		tourist.itineraries.splice(itineraryIndex, 1);

		await tourist.save();

		res.status(200).json({
			message: 'Itinerary cancelled successfully',
			refundedAmount: itinerary.price.toFixed(2),
			newBalance: tourist.wallet.balance.toFixed(2),
		});
	} catch (error) {
		console.error('Error canceling itinerary:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
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
exports.bookTransportation = async (req, res) => {
	try {
		const userId = req.user._id;
		const transportationId = req.params.id;
		const seatsToBook = req.body.seats || 1; // Default to 1 seat if not provided

		console.log('User ID:', userId);
		console.log('Transportation ID:', transportationId);
		console.log('Seats to Book:', seatsToBook);

		const tourist = await Tourist.findById(userId);
		const transportation = await Transportation.findById(transportationId);

		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });
		if (!transportation || transportation.isArchived)
			return res.status(404).json({ message: 'Transportation not available' });

		// Check if the transportation is already booked
		if (tourist.transportations.includes(transportationId)) {
			return res
				.status(400)
				.json({ message: 'Transportation has already been booked' });
		}

		// Check if there are enough available seats
		if (seatsToBook > transportation.availableSeats) {
			return res
				.status(400)
				.json({ message: 'Selected seats exceed available seats' });
		}

		// Calculate total price based on the number of seats
		const pricePerSeat = transportation.pricePerSeat;
		const totalPrice = seatsToBook * pricePerSeat;
		const currentBalance = tourist.wallet.balance || 0;

		// Check if the tourist has enough balance
		if (currentBalance < totalPrice) {
			return res.status(400).json({ message: 'Insufficient wallet balance' });
		}

		// Deduct price from the tourist's wallet
		tourist.wallet.balance -= totalPrice;

		// Deduct the booked seats from available seats
		transportation.availableSeats -= seatsToBook;

		// Calculate and add points
		const pointsMultiplier =
			tourist.points >= 500000 ? 1.5 : tourist.points >= 100000 ? 1 : 0.5;
		const pointsEarned = totalPrice * pointsMultiplier;
		tourist.points += pointsEarned;

		// Add the transportation booking to the tourist's record
		tourist.transportations.push(transportationId);

		// Save the updated data
		await tourist.save();
		await transportation.save();

		// Send response
		res.status(200).json({
			message: 'Transportation booked successfully',
			transportation: {
				...transportation.toObject(),
				bookedSeats: seatsToBook,
			},
			updatedWalletBalance: tourist.wallet.balance.toFixed(2),
			pointsEarned: Math.floor(pointsEarned),
			totalPoints: Math.floor(tourist.points),
		});
	} catch (error) {
		console.error('Error booking transportation:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};
exports.getBookedTransportations = async (req, res) => {
	try {
		const userId = req.user._id;

		// Find the tourist and populate the transportations field
		const tourist = await Tourist.findById(userId).populate('transportations');

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json(tourist.transportations);
	} catch (error) {
		console.error('Error fetching booked transportations:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

// Cancel a specific booked transportation for the logged-in user
exports.cancelBooking = async (req, res) => {
	try {
		const userId = req.user._id;
		const transportationId = req.params.id;

		// Find the tourist
		const tourist = await Tourist.findById(userId);
		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

		// Check if the transportation is in the user's bookings
		const transportationIndex =
			tourist.transportations.indexOf(transportationId);
		if (transportationIndex === -1) {
			return res.status(400).json({ message: 'Booking not found' });
		}

		// Remove the transportation from the user's bookings
		tourist.transportations.splice(transportationIndex, 1);
		await tourist.save();

		res.status(200).json({ message: 'Booking canceled successfully' });
	} catch (error) {
		console.error('Error canceling booking:', error);
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};
exports.getTouristCountByMonthForActivity = async (req, res) => {
	try {
		const userId = req.user._id; // The logged-in advertiser's user ID

		// Get the current date and extract the month/year to filter by
		const currentDate = new Date();

		// Find all tourists and populate their activities
		const tourists = await Tourist.find().populate({
			path: 'activities',
			populate: {
				path: 'advertiserId', // Populate the advertiserId within each activity
				model: 'User', // Ensure this matches your actual model name for Advertisers
			},
		});

		if (!tourists || tourists.length === 0) {
			return res.status(404).json({ message: 'No tourists found' });
		}

		// Map to hold the count of tourists by month
		const touristCountByMonth = {};

		// Loop through all tourists and their activities
		tourists.forEach((tourist) => {
			tourist.activities.forEach((activity) => {
				// Check if the advertiser ID matches
				if (activity.advertiserId._id.toString() === userId) {
					const activityDate = new Date(activity.date);
					const monthYear = `${
						activityDate.getMonth() + 1
					}-${activityDate.getFullYear()}`;

					// Initialize the count if not already set
					if (!touristCountByMonth[monthYear]) {
						touristCountByMonth[monthYear] = 0;
					}

					// Increment the count for that month
					touristCountByMonth[monthYear]++;
				}
			});
		});

		// Return the count of tourists by month
		res.status(200).json({
			touristCountByMonth,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
};

exports.createSetupIntent = async (req, res) => {
	const { userId } = req.body;

	try {
		// Create a SetupIntent to save the payment method for later use
		const setupIntent = await stripe.setupIntents.create({
			payment_method_types: ['card'], // Specify card as payment method
		});

		// Send the client secret to the frontend to complete the setup
		return res.status(200).json({
			clientSecret: setupIntent.client_secret,
		});
	} catch (error) {
		console.error('Error creating setup intent:', error);
		return res
			.status(400)
			.json({ message: error.message || 'Something went wrong' });
	}
};

exports.payStripeActivity = async (req, res) => {
	const { amount, currency = 'usd', paymentMethodId, walletAmount } = req.body;
	const activityId = req.body.activityId;
	const userId = req.user._id;

	try {
		// Find the tourist and activity
		const activity = await Activity.findById(activityId);
		if (!activity)
			return res.status(404).json({ message: 'Activity not found' });

		const tourist = await Tourist.findById(userId);
		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

		// Check if the activity is already booked by the tourist
		if (tourist.activities.includes(activityId)) {
			return res
				.status(400)
				.json({ message: 'Activity has already been booked' });
		}

		// Update the `isBooked` attribute of the activity
		activity.isBooked = true;
		await activity.save();

		// Add activity to the tourist's list of booked activities
		tourist.activities.push(activityId);
		await tourist.save();

		// Log incoming request data for debugging
		console.log('Request Body:', req.body);

		// Create a PaymentIntent with Stripe
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			payment_method: paymentMethodId,
			confirm: true, // Automatically confirm the payment
			automatic_payment_methods: {
				enabled: true,
			},
			return_url: 'https://your-site.com/payment-success', // Replace with your actual URL
		});

		// Log the payment intent response for debugging
		console.log('Payment Intent:', paymentIntent);

		return res.status(200).json({
			message: 'Payment successful!',
			paymentIntentId: paymentIntent.id, // Optionally send the payment intent ID back to the frontend
		});
	} catch (error) {
		// Log the error to the console
		console.error('Payment processing error:', error);
		return res.status(400).json({
			message: error.message || 'Something went wrong',
			error, // Log full error details to help debugging
		});
	}
};
exports.payStripeItinerary = async (req, res) => {
	const { amount, currency = 'usd', paymentMethodId, walletAmount } = req.body;
	const itineraryId = req.body.itineraryId; // Assuming itineraryId is passed in the request body
	const userId = req.user._id;

	try {
		// Find the tourist and itinerary
		const itinerary = await Itinerary.findById(itineraryId); // Fetch itinerary from database
		if (!itinerary)
			return res.status(404).json({ message: 'Itinerary not found' });

		const tourist = await Tourist.findById(userId);
		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

		// Check if the itinerary is already booked by the tourist
		if (tourist.itineraries.includes(itineraryId)) {
			return res
				.status(400)
				.json({ message: 'Itinerary has already been booked' });
		}

		// Update the `isBooked` attribute of the itinerary
		itinerary.isBooked = true;
		await itinerary.save();

		// Add itinerary to the tourist's list of booked itineraries
		tourist.itineraries.push(itineraryId);
		await tourist.save();

		// Log incoming request data for debugging
		console.log('Request Body:', req.body);

		// Create a PaymentIntent with Stripe
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			payment_method: paymentMethodId,
			confirm: true, // Automatically confirm the payment
			automatic_payment_methods: {
				enabled: true,
			},
			return_url: 'https://your-site.com/payment-success', // Replace with your actual URL
		});

		// Log the payment intent response for debugging
		console.log('Payment Intent:', paymentIntent);

		return res.status(200).json({
			message: 'Payment successful!',
			paymentIntentId: paymentIntent.id, // Optionally send the payment intent ID back to the frontend
		});
	} catch (error) {
		// Log the error to the console
		console.error('Payment processing error:', error);
		return res.status(400).json({
			message: error.message || 'Something went wrong',
			error, // Log full error details to help debugging
		});
	}
};

exports.addProductToWishList = async (req, res) => {
	try {
		const userId = req.user._id;
		const { productId } = req.body;

		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		if (tourist.wishList.includes(productId)) {
			return res
				.status(400)
				.json({ message: 'Product is already in the wish list' });
		}

		tourist.wishList.push(productId);

		await tourist.save();

		res
			.status(200)
			.json({ message: 'Product added to wish list successfully' });
	} catch (error) {
		console.error('Error adding product to wish list:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.removeProductFromWishList = async (req, res) => {
	try {
		const userId = req.user._id; // Auth middleware should attach user info to req
		const { productId } = req.params; // Product ID from route parameter

		// Find the tourist by their ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Check if the product exists in the wish list
		if (!tourist.wishList.includes(productId)) {
			return res
				.status(400)
				.json({ message: 'Product not found in the wish list' });
		}

		// Remove the product from the wish list
		tourist.wishList = tourist.wishList.filter(
			(id) => id && id.toString() !== productId
		);

		// Save the updated tourist document
		await tourist.save();

		res.status(200).json({
			message: 'Product removed from wish list successfully',
			wishList: tourist.wishList, // Optional: return updated wish list
		});
	} catch (error) {
		console.error('Error removing product from wish list:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getTouristWishList = async (req, res) => {
	try {
		const touristId = req.user._id; // Assuming authentication middleware attaches user info
		const tourist = await Tourist.findById(touristId).populate('wishList');

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json(tourist.wishList); // Directly return the populated wish list
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error retrieving wish list' });
	}
};

exports.addProductToCart = async (req, res) => {
	try {
		const userId = req.user._id; // Auth middleware attaches user info to req
		const productId = req.params.productId || req.params.id;
		const { quantity = 1 } = req.body; // Default quantity to 1 if not provided

		// Ensure the quantity is at least 1
		if (quantity < 1) {
			return res.status(400).json({ message: 'Quantity must be at least 1' });
		}

		// Find the tourist by their ID
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Check if the product already exists in the cart
		const existingProduct = tourist.cart.find(
			(item) => item.productId && item.productId.toString() === productId
		);

		if (existingProduct) {
			// If the product exists, update the quantity
			return res
				.status(401)
				.json({ message: 'Product already exists in cart' });
		} else {
			// If the product does not exist, add a new entry with the quantity
			tourist.cart.push({ productId: productId, quantity: quantity });
		}

		// Save the updated tourist document
		await tourist.save();

		res.status(200).json({ message: 'Product added to cart successfully' });
	} catch (error) {
		console.error('Error adding product to cart:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

// Get the tourist's cart with populated product data
exports.getTouristCart = async (req, res) => {
	try {
		const touristId = req.user._id; // Assuming authentication middleware attaches user info
		const tourist = await Tourist.findById(touristId).populate(
			'cart.productId'
		);

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json(tourist.cart); // Return the populated cart
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error retrieving cart' });
	}
};

// Update the quantity of a product in the cart
// Update the quantity of a product in the cart
exports.updateCartItemQuantity = async (req, res) => {
	try {
		const userId = req.user._id;
		const { productId } = req.params; // This is the productId coming from the URL
		const { quantity } = req.body;

		// Ensure quantity is valid
		if (quantity < 1) {
			return res.status(400).json({ message: 'Quantity must be at least 1' });
		}

		// Find the tourist and populate the cart
		const tourist = await Tourist.findById(userId).populate('cart.productId');
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Find the cart item using .equals() for ObjectId comparison
		const cartItem = tourist.cart.find(
			(item) => item.productId._id.equals(productId) // Use .equals() for proper ObjectId comparison
		);

		if (!cartItem) {
			return res.status(404).json({ message: 'Product not found in cart' });
		}

		// Find the product and its available stock
		const product = cartItem.productId;

		// Calculate stock change (decrease if increasing quantity, increase if decreasing)
		const stockChange =
			quantity > cartItem.quantity
				? quantity - cartItem.quantity
				: cartItem.quantity - quantity;

		// Ensure quantity does not exceed the available stock or go below 1
		if (quantity > product.quantity) {
			return res.status(400).json({
				message: 'Quantity must be less than or equal to the available stock',
			});
		}

		// Update the cart item quantity
		cartItem.quantity = quantity;

		// Save the updated tourist data with new stock and cart item quantity
		await product.save();
		await tourist.save();

		res.status(200).json({
			message: 'Cart updated successfully',
			cart: tourist.cart, // Return the updated cart
		});
	} catch (error) {
		console.error('Error updating cart item:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

// Remove a product from the cart
exports.removeCartItem = async (req, res) => {
	try {
		const userId = req.user._id;
		const { productId } = req.params;

		// Find the tourist and populate the cart
		const tourist = await Tourist.findById(userId);
		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Remove the cart item by productId
		tourist.cart = tourist.cart.filter(
			(item) => item.productId.toString() !== productId
		);

		// Save the updated cart
		await tourist.save();

		res
			.status(200)
			.json({ message: 'Product removed from cart', cart: tourist.cart });
	} catch (error) {
		console.error('Error removing cart item:', error);
		res.status(500).json({ message: 'Server error' });
	}
};
// Buy products in the cart (finalize the purchase)
// Buy products in the cart (finalize the purchase)
exports.buyProductsCard = async (req, res) => {
	try {
		const userId = req.user._id; // Get the user ID from authentication
		const tourist = await Tourist.findById(userId).populate('cart.productId'); // Populate the cart with product details

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		// Check if the cart is empty
		if (tourist.cart.length === 0) {
			return res.status(400).json({ message: 'Cart is empty' });
		}

		// Calculate the total cost of the purchase
		let totalCost = 0;
		let pointsEarned = 0;

		// Process each item in the cart
		for (let item of tourist.cart) {
			const product = item.productId;

			// Ensure that the quantity does not exceed the available stock
			if (item.quantity > product.stock) {
				return res.status(400).json({
					message: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
				});
			}

			// Calculate the total cost for this product
			const productCost = product.price * item.quantity;
			totalCost += productCost;

			// Calculate points earned based on product price (this can be adjusted as needed)
			let pointsMultiplier = 0.5; // Default multiplier for level 1
			if (tourist.points >= 100000) pointsMultiplier = 1; // Level 2
			if (tourist.points >= 500000) pointsMultiplier = 1.5; // Level 3

			pointsEarned += productCost * pointsMultiplier;

			// Reduce the stock after purchase
			product.quantity -= item.quantity; // Decrease stock based on the quantity purchased
			await product.save();

			// Add the purchased item to the tourist's purchase history
			tourist.purchased.push({
				productId: product._id,
				quantity: item.quantity,
				purchaseDate: new Date(),
			});
		}

		// Check if the tourist has enough balance in their wallet to cover the total cost
		if (tourist.wallet.balance < totalCost) {
			return res.status(400).json({ message: 'Insufficient wallet balance' });
		}

		// Deduct the total cost from the tourist's wallet
		tourist.wallet.balance -= totalCost;

		// Add the points earned from this purchase to the tourist's total points
		tourist.points += pointsEarned;

		// Clear the cart after the purchase
		tourist.cart = [];
		await tourist.save();

		// Log the transaction details
		console.log({
			message: 'Purchase successful',
			transactionDetails: {
				totalCost: totalCost.toFixed(2),
				updatedWalletBalance: tourist.wallet.balance.toFixed(2),
				pointsEarned: Math.floor(pointsEarned),
				totalPoints: Math.floor(tourist.points),
			},
		});

		// Respond with the purchase success message and transaction details
		res.status(200).json({
			message: 'Purchase successful. Your cart has been cleared.',
			transactionDetails: {
				totalCost: totalCost.toFixed(2),
				updatedWalletBalance: tourist.wallet.balance.toFixed(2),
				pointsEarned: Math.floor(pointsEarned),
				totalPoints: Math.floor(tourist.points),
			},
		});
	} catch (error) {
		console.error('Error during purchase:', error);
		res.status(500).json({ message: 'Server error during purchase' });
	}
};

exports.buyProductsCardVisa = async (req, res) => {
	try {
		const userId = req.user._id; // Get the user ID from authentication
		const { paymentMethodId, currency = 'usd' } = req.body;

		// Fetch the tourist's details along with the cart
		const tourist = await Tourist.findById(userId).populate('cart.productId');
		if (!tourist) return res.status(404).json({ message: 'Tourist not found' });

		// Check if the cart is empty
		if (tourist.cart.length === 0) {
			return res.status(400).json({ message: 'Cart is empty' });
		}

		// Calculate the total cost of the purchase
		let totalCost = 0;
		let pointsEarned = 0;

		// Process each item in the cart
		for (let item of tourist.cart) {
			const product = item.productId;

			// Ensure stock availability
			if (item.quantity > product.stock) {
				return res.status(400).json({
					message: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
				});
			}

			// Calculate the total cost and reduce stock
			const productCost = product.price * item.quantity;
			totalCost += productCost;

			// Reduce stock after purchase
			product.stock -= item.quantity;
			await product.save();

			// Calculate points earned based on the product price
			let pointsMultiplier = 0.5; // Level 1 multiplier
			if (tourist.points >= 100000) pointsMultiplier = 1; // Level 2
			if (tourist.points >= 500000) pointsMultiplier = 1.5; // Level 3
			pointsEarned += productCost * pointsMultiplier;
		}

		// Process payment with Stripe
		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.round(totalCost * 100), // Convert amount to cents
				currency,
				payment_method: paymentMethodId,
				confirm: true, // Automatically confirm the payment
				automatic_payment_methods: {
					enabled: true, // Enable automatic payment methods
				},
				return_url: 'https://your-site.com/payment-success', // Replace with your actual URL
			});

			// Log the payment intent for debugging
			console.log('Payment Intent:', paymentIntent);

			if (paymentIntent.status !== 'succeeded') {
				return res.status(400).json({ message: 'Payment failed. Try again.' });
			}

			// Update the tourist's points and clear the cart
			tourist.points += pointsEarned;
			tourist.cart = [];
			await tourist.save();

			// Respond with a success message
			res.status(200).json({
				message: 'Purchase successful. Your cart has been cleared.',
				transactionDetails: {
					totalCost: totalCost.toFixed(2),
					pointsEarned: Math.floor(pointsEarned),
					totalPoints: Math.floor(tourist.points),
				},
			});
		} catch (paymentError) {
			console.error('Stripe Payment Error:', paymentError);
			return res.status(500).json({
				message: 'Payment failed. Please check your payment details.',
			});
		}
	} catch (error) {
		// Handle errors gracefully
		console.error('Error during purchase:', error);
		res
			.status(500)
			.json({ message: error.message || 'Server error during purchase' });
	}
};

const transporter = nodemailer.createTransport({
	service: 'gmail', // You can change this depending on your email provider
	auth: {
		user: process.env.USER_EMAIL, // Replace with your email
		pass: process.env.USER_PASS, // Replace with your email password or app-specific password
	},
});
// Get previous purchases from the tourist's purchase history
exports.getPreviousPurchases = async (req, res) => {
	try {
		const touristId = req.user._id; // Get the tourist's ID from the authenticated user
		const tourist = await Tourist.findById(touristId).populate(
			'purchased.productId'
		);

		if (!tourist) {
			return res.status(404).json({ message: 'Tourist not found' });
		}

		res.status(200).json(tourist.purchased); // Return the previous purchases
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error retrieving previous purchases' });
	}
};
