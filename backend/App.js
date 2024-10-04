const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const {searchProductByName, getAllProducts, filterProductsByPrice}= require('./routes/Products')

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

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

app.use(express.json())
app.get("/searchProductByName",searchProductByName);
app.get('/getAllProducts', getAllProducts);
app.get('/filterProductsByPrice', filterProductsByPrice);