const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const TourGuideRoute = require('./Routes/TourGuideRoute')
const AdvertiserRoute = require('./Routes/AdvertiserRoute');
const ItineraryRoutes = require('./Routes/ItineraryRoute');
mongoose.set("strictQuery", false);
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware 
app.use(bodyParser.json());

// Use the tour guide routes 
app.use('/profiles', TourGuideRoute);

// Use the advertiser routes
app.use('/advertisers', AdvertiserRoute);

app.use('/itineraries', ItineraryRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
    app.listen(PORT, () => {
      console.log(`Listening to requests on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
