const express = require("express");
const mongoose = require("mongoose");
const historicalPlacesRouter = require("./routes/HistoricalPlaces");
const museumsRouter = require("./routes/Museums");
const tagsRouter = require("./routes/Tag");
const bodyParser = require("body-parser");
const TourGuideRoute = require("./routes/TourGuideRoute");
const AdvertiserRoute = require("./routes/AdvertiserRoute");
const ItineraryRoutes = require("./routes/ItineraryRoute");
const productRoutes = require("./routes/Products");
const activityRoutes = require("./routes/Activity");
const itineraryRoutes = require("./routes/Itinerary");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use("/products", productRoutes);
app.use("/activity", activityRoutes);
app.use("/itinerary", itineraryRoutes);

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
