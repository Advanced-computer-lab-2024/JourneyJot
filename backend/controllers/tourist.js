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
		const tourist = await Tourist.findById(userId);

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

		// Assuming you have a Wallet model
		// if (tourist.wallet.balance < product.price * quantity) {
		//   return res.status(400).json({ message: "Insufficient funds" });
		// }

		// // Deduct the amount from the wallet
		// tourist.wallet.balance -= product.price * quantity;
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

		// Find the activity by ID to get the price
		const activity = await Activity.findById(activityId);
		if (!activity) {
			return res.status(404).json({ message: 'Activity not found' });
		}

		// Check if wallet has enough balance
		// if (tourist.wallet.balance < activity.price) {
		//   return res.status(400).json({
		//     message: "Insufficient wallet balance to book this activity",
		//     requiredAmount: activity.price - tourist.wallet.balance,
		//   });
		// }

		// // Deduct the price from wallet balance
		// tourist.wallet.balance -= activity.price;
		tourist.activities.push(activityId);

		// Save the updated tourist data
		await tourist.save();
		console.log(activity);
		console.log(tourist);
		res.status(200).json({ message: 'Activity booked successfully' });
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

		// // Check if wallet has enough balance
		// if (tourist.wallet.balance < attraction.price) {
		//   return res.status(400).json({
		//     message: "Insufficient wallet balance to book this attraction",
		//     requiredAmount: attraction.price - tourist.wallet.balance,
		//   });
		// }

		// // Deduct the price from wallet balance
		// tourist.wallet.balance -= attraction.price;

		// Add the attraction to the tourist's list
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

		// Check if wallet has enough balance
		// if (tourist.wallet.balance < itinerary.price) {
		//   return res.status(400).json({
		//     message: "Insufficient wallet balance to book this itinerary",
		//     requiredAmount: itinerary.price - tourist.wallet.balance,
		//   });
		// }

		// // Deduct the price from wallet balance
		// tourist.wallet.balance -= itinerary.price;

		// Add the itinerary to the tourist's list
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
			// Populate activities with the entire document (including advertiserId)
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

// controllers/touristController.js

const Activity = require('../models/Activity');

exports.rateActivity = async (req, res) => {
    const { rating, activityId } = req.body;
    const touristId = req.user.id; // Assuming tourist ID is obtained from auth middleware

    try {
        // Find the activity
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        // Check if the tourist attended the activity
        const hasAttended = activity.attendees.includes(touristId);
        if (!hasAttended) {
            return res.status(400).json({ error: 'Only attendees can rate this activity' });
        }

        // Add the rating to the activity
        activity.ratings.push({ rating, tourist: touristId });
        activity.ratingCount += 1;
        activity.averageRating = (activity.averageRating * (activity.ratingCount - 1) + rating) / activity.ratingCount;

        await activity.save();
        res.json({ message: 'Rating submitted successfully', activity });
    } catch (error) {
        console.error('Error rating activity:', error);
        res.status(500).json({ error: 'Server error while rating activity' });
    }
};


exports.commentOnActivity = async (req, res) => {
  const { text, activityId } = req.body;
  const touristId = req.user.id; // Assuming tourist ID is obtained from auth middleware

  try {
      // Find the activity
      const activity = await Activity.findById(activityId);
      if (!activity) {
          return res.status(404).json({ error: 'Activity not found' });
      }

      // Check if the tourist attended the activity
      const hasAttended = activity.attendees.includes(touristId);
      if (!hasAttended) {
          return res.status(400).json({ error: 'Only attendees can comment on this activity' });
      }

      // Add the comment to the activity
      const comment = { text, tourist: touristId };
      activity.comments.push(comment);

      await activity.save();
      res.json({ message: 'Comment added successfully', comment });
  } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Server error while adding comment' });
  }
};

const TourGuideProfile = require('../models/Tour-Guide');

exports.rateTourGuide = async (req, res) => {
    const { rating, guideId } = req.body;
    const touristId = req.user.id; // Assuming tourist ID is obtained from auth middleware

    try {
        // Find the tour guide
        const tourGuide = await TourGuideProfile.findById(guideId);
        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        // Check if the tourist completed a tour with the guide
        // Assuming a `completedTours` array exists for each tourist, containing the IDs of guides they completed tours with
        const hasCompletedTour = req.user.completedTours.includes(guideId);
        if (!hasCompletedTour) {
            return res.status(400).json({ error: 'Only tourists who completed a tour with this guide can rate them' });
        }

        // Add the rating to the tour guide
        tourGuide.ratings.push({ rating, tourist: touristId });
        tourGuide.ratingCount += 1;
        tourGuide.averageRating = (tourGuide.averageRating * (tourGuide.ratingCount - 1) + rating) / tourGuide.ratingCount;

        await tourGuide.save();
        res.json({ message: 'Rating submitted successfully', tourGuide });
    } catch (error) {
        console.error('Error rating tour guide:', error);
        res.status(500).json({ error: 'Server error while rating tour guide' });
    }
  };

exports.commentOnTourGuide = async (req, res) => {
    const { text, guideId } = req.body;
    const touristId = req.user.id; // Assuming tourist ID is obtained from auth middleware

    try {
        // Find the tour guide
        const tourGuide = await TourGuideProfile.findById(guideId);
        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        // Check if the tourist completed a tour with this guide
        const hasCompletedTour = req.user.completedTours.includes(guideId);
        if (!hasCompletedTour) {
            return res.status(400).json({ error: 'Only tourists who completed a tour with this guide can comment' });
        }

        // Add the comment
        const comment = { text, tourist: touristId };
        tourGuide.comments.push(comment);

        await tourGuide.save();
        res.json({ message: 'Comment added successfully', comment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error while adding comment' });
    }
};



const Itinerary = require('../models/Itinerary');
const User = require('../models/User');

// Function for rating an itinerary
exports.rateItinerary = async (req, res) => {
    const { itineraryId, rating } = req.body;
    const touristId = req.user.id; // Assuming the tourist ID is available from the auth middleware

    try {
        // Find the itinerary
        const itinerary = await Itinerary.findById(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        // Check if the tourist has completed the tour with the guide
        const hasCompletedTour = req.user.completedItineraries.includes(itineraryId);

        if (!hasCompletedTour) {
            return res.status(400).json({ error: 'Only tourists who completed this tour can rate' });
        }

        // Check that the rating is between 1 and 5
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Add the rating to the itinerary
        itinerary.ratings.push({ tourist: touristId, rating });

        // Save the itinerary with the new rating
        await itinerary.save();

        res.json({ message: 'Rating added successfully', itinerary });
    } catch (error) {
        console.error('Error rating itinerary:', error);
        res.status(500).json({ error: 'Server error while adding rating' });
    }
};

// Function for commenting on an itinerary
exports.commentOnItinerary = async (req, res) => {
    const { itineraryId, comment } = req.body;
    const touristId = req.user.id; // Assuming the tourist ID is available from the auth middleware

    try {
        // Find the itinerary
        const itinerary = await Itinerary.findById(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ error: 'Itinerary not found' });
        }

        // Check if the tourist has completed the tour with the guide
        const hasCompletedTour = req.user.completedItineraries.includes(itineraryId);

        if (!hasCompletedTour) {
            return res.status(400).json({ error: 'Only tourists who completed this tour can comment' });
        }

        // Add the comment to the itinerary
        itinerary.comments.push({ tourist: touristId, comment });

        // Save the itinerary with the new comment
        await itinerary.save();

        res.json({ message: 'Comment added successfully', itinerary });
    } catch (error) {
        console.error('Error commenting on itinerary:', error);
        res.status(500).json({ error: 'Server error while adding comment' });
    }
};


