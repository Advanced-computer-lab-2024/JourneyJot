/** @format */

const Flight = require('../models/Flight');
const Tourist = require('../models/Tourist');

// List all booked flights for the logged-in tourist
exports.listBookedFlights = async (req, res) => {
	try {
		const flights = await Flight.find({ tourist: req.user._id }).populate(
			'tourist'
		);

		res.status(200).json(flights);
	} catch (error) {
		console.error('Error listing booked flights:', error);
		res.status(500).json({ message: 'Error listing booked flights.', error });
	}
};

exports.createFlightBooking = async (req, res) => {
	try {
		const touristId = req.user._id;
		const {
			flightId,
			origin,
			destination,
			departureDate,
			price,
			seatsAvailable,
			airline,
			passenger,
		} = req.body;

		const tourist = await Tourist.findById(touristId);
		if (!tourist) return res.status(404).json({ error: 'Tourist not found.' });

		const totalCost = parseFloat(price.total);

		// Check wallet balance
		if (tourist.wallet.balance < totalCost) {
			return res.status(400).json({ message: 'Insufficient wallet balance.' });
		}

		// Deduct from wallet
		tourist.wallet.balance -= totalCost;

		// Calculate points based on levels
		let pointsMultiplier = 0.5; // Default multiplier for level 1
		if (tourist.points >= 100000) pointsMultiplier = 1; // Level 2
		if (tourist.points >= 500000) pointsMultiplier = 1.5; // Level 3
		const pointsEarned = totalCost * pointsMultiplier;
		tourist.points += pointsEarned;

		// Create and save flight booking
		const flight = new Flight({
			flightId,
			origin,
			destination,
			departureDate,
			price,
			seatsAvailable,
			airline,
			tourist: touristId,
			passenger,
		});
		await flight.save();

		// Save tourist changes
		await tourist.save();

		res.status(201).json({
			message: 'Flight booked successfully!',
			flight,
			wallet: tourist.wallet.balance.toFixed(2),
			points: Math.floor(tourist.points),
		});
	} catch (error) {
		console.error('Error booking flight:', error.message);
		res.status(500).json({ error: 'Failed to book flight.' });
	}
};

// Get flight details by ID
exports.getFlightDetails = async (req, res) => {
	const { flightId } = req.params;

	try {
		const flight = await Flight.findById(flightId).populate('tourist');
		if (!flight) {
			return res.status(404).json({ error: 'Flight not found.' });
		}

		res.status(200).json(flight);
	} catch (error) {
		console.error('Error fetching flight details:', error);
		res.status(500).json({ message: 'Error fetching flight details.', error });
	}
};

// Delete a booked flight
exports.deleteFlightBooking = async (req, res) => {
	const { flightId } = req.params;

	try {
		const flight = await Flight.findByIdAndDelete(flightId);
		if (!flight) {
			return res.status(404).json({ error: 'Flight not found.' });
		}

		// Remove the flight from the tourist's flights array
		await Tourist.findByIdAndUpdate(flight.tourist, {
			$pull: { flights: flight._id },
		});

		res.status(200).json({ message: 'Flight booking deleted successfully.' });
	} catch (error) {
		console.error('Error deleting flight booking:', error);
		res.status(500).json({ message: 'Error deleting flight booking.', error });
	}
};

// List all booked flights for the logged-in tourist
exports.listBookedFlights = async (req, res) => {
	try {
		const flights = await Flight.find({ tourist: req.user._id }).populate(
			'tourist'
		);

		res.status(200).json(flights);
	} catch (error) {
		console.error('Error listing booked flights:', error);
		res.status(500).json({ message: 'Error listing booked flights.', error });
	}
};

exports.createFlightBooking = async (req, res) => {
	try {
		const touristId = req.user._id;
		const {
			flightId,
			origin,
			destination,
			departureDate,
			price,
			seatsAvailable,
			airline,
			passenger,
		} = req.body;

		const tourist = await Tourist.findById(touristId);
		if (!tourist) return res.status(404).json({ error: 'Tourist not found.' });

		const totalCost = parseFloat(price.total);

		// Check wallet balance
		if (tourist.wallet.balance < totalCost) {
			return res.status(400).json({ message: 'Insufficient wallet balance.' });
		}

		// Deduct from wallet
		tourist.wallet.balance -= totalCost;

		// Calculate points based on levels
		let pointsMultiplier = 0.5; // Default multiplier for level 1
		if (tourist.points >= 100000) pointsMultiplier = 1; // Level 2
		if (tourist.points >= 500000) pointsMultiplier = 1.5; // Level 3
		const pointsEarned = totalCost * pointsMultiplier;
		tourist.points += pointsEarned;

		// Create and save flight booking
		const flight = new Flight({
			flightId,
			origin,
			destination,
			departureDate,
			price,
			seatsAvailable,
			airline,
			tourist: touristId,
			passenger,
		});
		await flight.save();

		// Save tourist changes
		await tourist.save();

		res.status(201).json({
			message: 'Flight booked successfully!',
			flight,
			wallet: tourist.wallet.balance.toFixed(2),
			points: Math.floor(tourist.points),
		});
	} catch (error) {
		console.error('Error booking flight:', error.message);
		res.status(500).json({ error: 'Failed to book flight.' });
	}
};

// Get flight details by ID
exports.getFlightDetails = async (req, res) => {
	const { flightId } = req.params;

	try {
		const flight = await Flight.findById(flightId).populate('tourist');
		if (!flight) {
			return res.status(404).json({ error: 'Flight not found.' });
		}

		res.status(200).json(flight);
	} catch (error) {
		console.error('Error fetching flight details:', error);
		res.status(500).json({ message: 'Error fetching flight details.', error });
	}
};

// Delete a booked flight
exports.deleteFlightBooking = async (req, res) => {
	const { flightId } = req.params;

	try {
		const flight = await Flight.findByIdAndDelete(flightId);
		if (!flight) {
			return res.status(404).json({ error: 'Flight not found.' });
		}

		// Remove the flight from the tourist's flights array
		await Tourist.findByIdAndUpdate(flight.tourist, {
			$pull: { flights: flight._id },
		});

		res.status(200).json({ message: 'Flight booking deleted successfully.' });
	} catch (error) {
		console.error('Error deleting flight booking:', error);
		res.status(500).json({ message: 'Error deleting flight booking.', error });
	}
};
