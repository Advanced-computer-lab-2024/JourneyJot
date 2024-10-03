const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const historicalPlacesRouter = require("./routes/HistoricalPlaces");
const museumsRouter = require("./routes/Museums");
const tagsRouter = require("./routes/Tag");
const cors = require("cors");

mongoose.set("strictQuery", false);
require("dotenv").config();
const productRoutes = require("./routes/Products");

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

app.use("/historical-places", historicalPlacesRouter);
app.use("/museums", museumsRouter);
app.use("/api", tagsRouter);
app.use("/products", productRoutes);
