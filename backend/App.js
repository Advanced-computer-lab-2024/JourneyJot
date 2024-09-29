const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const historicalPlacesRouter = require("./routes/HistoricalPlaces");
const museumsRouter = require("./routes/Museum");
const tagsRouter = require("./routes/Tag");

mongoose.set("strictQuery", false);

const app = express();

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

app.use("/api/historical-places", historicalPlacesRouter);
app.use("/api/museums", museumsRouter);
app.use("/api", tagsRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});
