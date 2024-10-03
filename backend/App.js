const express = require("express");
const mongoose = require("mongoose");
const historicalPlacesRouter = require("./routes/HistoricalPlaces");
const museumsRouter = require("./routes/Museums");
const tagsRouter = require("./routes/Tag");
const bodyParser = require("body-parser");
const TourGuideRoute = require("./Routes/TourGuideRoute");
const AdvertiserRoute = require("./Routes/AdvertiserRoute");
const ItineraryRoutes = require("./Routes/ItineraryRoute");
const productRoutes = require("./routes/Products");
const cors = require("cors");
require("dotenv").config();

mongoose.set("strictQuery", false);

app.use(bodyParser.json()); // Middleware to parse the body of the request
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB is now connected!");

    app.listen(PORT, () => {
      console.log(`Listening to requests on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// Use the tour guide routes
app.use("/profiles", TourGuideRoute);
// Use the advertiser routes
app.use("/advertisers", AdvertiserRoute);
app.use("/itineraries", ItineraryRoutes);
app.use("/historical-places", historicalPlacesRouter);
app.use("/museums", museumsRouter);
app.use("/api", tagsRouter);
app.use("/products", productRoutes);
