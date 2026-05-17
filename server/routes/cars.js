const express = require("express");
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Create a car (private)
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      model, dailyPrice, availability, registrationNumber,
      features, description, imageURL, location,
    } = req.body;

    if (!model || !dailyPrice || !registrationNumber) {
      return res.status(400).json({ message: "Model, daily price, and registration number are required" });
    }

    const car = await Car.create({
      model, dailyPrice, availability, registrationNumber,
      features, description, imageURL, location,
      addedBy: req.user.id,
    });

    res.status(201).json({ message: "Car added successfully", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all cars (public) with search, sort, filter
router.get("/", async (req, res) => {
  try {
    const { search, sort, availability, location } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { model: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (availability !== undefined) {
      query.availability = availability === "true";
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "price_asc") sortOption = { dailyPrice: 1 };
    else if (sort === "price_desc") sortOption = { dailyPrice: -1 };
    else if (sort === "popular") sortOption = { bookingCount: -1 };

    const cars = await Car.find(query).sort(sortOption).populate("addedBy", "name email");
    res.json({ cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my cars (private) - MUST be before /:id
router.get("/my/list", verifyToken, async (req, res) => {
  try {
    const { sort } = req.query;
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "price_asc") sortOption = { dailyPrice: 1 };
    else if (sort === "price_desc") sortOption = { dailyPrice: -1 };

    const cars = await Car.find({ addedBy: req.user.id }).sort(sortOption);
    res.json({ cars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single car (public)
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("addedBy", "name email");
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update car (private - owner only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (car.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this car" });
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete car (private - owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (car.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this car" });
    }

    await Booking.deleteMany({ car: req.params.id });
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
