/** @format */
const Tourist = require("../models/Tourist");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  const {
    username,
    email,
    password,
    mobileNumber,
    nationality,
    dob,
    occupation,
  } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    !mobileNumber ||
    !dob ||
    !nationality ||
    !occupation
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  bcrypt.hash(password, 10, (error, hashed) => {
    if (error) {
      res.status(500).send({ message: error.message });
    }
    const newTourist = new Tourist({
      username,
      email,
      password: hashed,
      mobileNumber,
      nationality,
      dob,
      occupation,
    });
    newTourist
      .save()

      .then((result) => {
        res
          .status(201)
          .json({ message: "User created successfully", user: result });
      })
      .catch((error) => {
        res.status(500).send({ message: error.message, error });
      });
  });
};

exports.login = (req, res, next) => {
  Tourist.find({ username: req.body.username })
    .exec()
    .then((tourist) => {
      if (tourist.length < 1) {
        return res
          .status(401)
          .json({ message: "Auth failed username does not exist" });
      }
      bcrypt.compare(req.body.password, tourist[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Auth failed" });
        } else if (result) {
          jwt.sign(
            { username: tourist[0].username, _id: tourist[0]._id },
            "cr7",
            {
              expiresIn: "12h",
            },
            (errors, results) => {
              if (errors) {
                return res.status(500).json({ error: errors.message });
              }
              return res.status(200).json({
                message: "Authentication successful",
                token: results,
              });
            }
          );
        } else {
          return res
            .status(401)
            .json({ message: "Auth failed incorrect password" });
        }
      });
    })
    .catch((error) => {
      console.log("Error finding user:", error);
      return res.status(401).json({ message: "Authentication failed" });
    });
};

// Get tourist profile
exports.getTouristProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using a middleware to attach user info to req.user
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({ profile: tourist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update tourist profile
exports.updateTouristProfile = async (req, res) => {
  const { mobileNumber, nationality, dob, occupation, wallet } = req.body; // Add any other fields you want to update

  try {
    const userId = req.user._id;
    const tourist = await Tourist.findById(userId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Update fields
    if (mobileNumber) tourist.mobileNumber = mobileNumber;
    if (nationality) tourist.nationality = nationality;
    if (dob) tourist.dob = dob;
    if (occupation) tourist.occupation = occupation;
    if (wallet) tourist.wallet = { ...tourist.wallet, ...wallet }; // Updating wallet

    await tourist.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: tourist,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
