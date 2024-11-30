const mongoose = require('mongoose');
const HotelSchema = new mongoose.Schema({
    hotelId: { type: String, required: true, unique: true }, // Ensure hotelId is unique and required
    hotelName: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: false, default: "" },
    price: {
        total: { type: String, required: true },
        currency: { type: String, required: true },
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    roomsAvailable: { type: Number, required: true },
    guestName: { type: String, required: true },
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "Tourist", required: true },
});


module.exports = mongoose.model('Hotel', HotelSchema);
