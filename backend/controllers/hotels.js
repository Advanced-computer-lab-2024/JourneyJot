/** @format */

const Hotel = require('../models/Hotel');
const Tourist = require('../models/Tourist');

// List all booked hotels for the logged-in tourist
exports.listBookedHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ tourist: req.user._id }).populate('tourist');

        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error listing booked hotels:', error);
        res.status(500).json({ message: 'Error listing booked hotels.', error });
    }
};

// Create hotel booking
exports.createHotelBooking = async (req, res) => {
    try {
        const touristId = req.user._id;  // Get the tourist (user) ID from the request (authenticated user)
        const { hotelId, location, checkInDate, checkOutDate, price, roomsAvailable, hotelName, guestName } = req.body;

        // Find the tourist (user) in the database
        const tourist = await Tourist.findById(touristId);
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found.' });
        }

        // Calculate the total cost for booking
        const totalCost = parseFloat(price.total);

        // Check if the tourist has sufficient balance in the wallet
        if (tourist.wallet.balance < totalCost) {
            return res.status(400).json({ message: 'Insufficient wallet balance.' });
        }

        // Deduct the total cost from the tourist's wallet balance
        tourist.wallet.balance -= totalCost;

        // Calculate points based on the tourist's points level
        let pointsMultiplier = 0.5;  // Default multiplier for level 1
        if (tourist.points >= 100000) pointsMultiplier = 1;  // Level 2 multiplier
        if (tourist.points >= 500000) pointsMultiplier = 1.5;  // Level 3 multiplier
        const pointsEarned = totalCost * pointsMultiplier;  // Calculate points earned from booking
        tourist.points += pointsEarned;  // Add points to the tourist's points balance

        // Create a new hotel booking in the database
        const hotel = new Hotel({
            hotelId,
            location,
            checkInDate,
            checkOutDate,
            price,
            roomsAvailable,
            hotelName,
            tourist: touristId,  // Associate the booking with the tourist
            guestName,
        });

        // Save the hotel booking to the database
        await hotel.save();

        // Save the updated tourist data (wallet balance and points)
        await tourist.save();

        // Return the booking confirmation and updated wallet/points information
        res.status(201).json({
            message: 'Hotel booked successfully!',
            hotel,
            wallet: tourist.wallet.balance.toFixed(2),  // Return the updated wallet balance
            points: Math.floor(tourist.points),  // Return the updated points
        });
    } catch (error) {
        console.error('Error booking hotel:', error.message);
        res.status(500).json({ error: 'Failed to book hotel.' });
    }
};

// Get hotel details by ID
exports.getHotelDetails = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const hotel = await Hotel.findById(hotelId).populate('tourist');
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found.' });
        }

        res.status(200).json(hotel);
    } catch (error) {
        console.error('Error fetching hotel details:', error);
        res.status(500).json({ message: 'Error fetching hotel details.', error });
    }
};

// Delete a booked hotel
exports.deleteHotelBooking = async (req, res) => {
    const { hotelId } = req.params;

    try {
        const hotel = await Hotel.findByIdAndDelete(hotelId);
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found.' });
        }

        // Remove the hotel from the tourist's hotels array
        await Tourist.findByIdAndUpdate(hotel.tourist, {
            $pull: { hotels: hotel._id },
        });

        res.status(200).json({ message: 'Hotel booking deleted successfully.' });
    } catch (error) {
        console.error('Error deleting hotel booking:', error);
        res.status(500).json({ message: 'Error deleting hotel booking.', error });
    }
};
