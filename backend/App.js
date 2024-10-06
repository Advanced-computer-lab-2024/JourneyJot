const express = require('express');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

const productRoutes = require('./routes/Products');
const activityRoutes = require('./routes/Activity');
const itineraryRoutes = require('./routes/Itinerary');
const viewRoutes = require('./routes/view');  // Existing routes
const historicalPlaceRoutes = require('./routes/HistoricalPlace'); // Add this line

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
app.use('/filter', activityRoutes);
app.use('/products', productRoutes);
app.use('/activity', activityRoutes);
app.use('/itinerary', itineraryRoutes);
app.use('/view', viewRoutes);  // Existing routes
app.use('/historical-places', historicalPlaceRoutes); // Add this line for historical places

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB is now connected!');
        // Starting server
        app.listen(PORT, () => {
            console.log(`Listening to requests on http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log(err));
