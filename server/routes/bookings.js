const express = require("express");
const Booking = require("../models/Booking");
const Car = require("../models/Car");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Create booking (private)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: "Car ID, start date, and end date are required" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    if (!car.availability) {
      return res.status(400).json({ message: "Car is not available for booking" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.dailyPrice;

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      car: carId,
      status: { $ne: "cancelled" },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ message: "Car is already booked for these dates" });
    }

    const booking = await Booking.create({
      car: carId,
      user: req.user.id,
      startDate: start,
      endDate: end,
      totalPrice,
    });

    // Increment bookingCount using $inc
    await Car.findByIdAndUpdate(carId, { $inc: { bookingCount: 1 } });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("car", "model imageURL dailyPrice")
      .populate("user", "name email");

    res.status(201).json({ message: "Booking created successfully", booking: populatedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my bookings (private)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("car", "model imageURL dailyPrice location")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking (private - owner only)
router.patch("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("car", "model imageURL dailyPrice")
      .populate("user", "name email");

    res.json({ message: "Booking cancelled successfully", booking: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modify booking dates (private - owner only)
router.patch("/:id/modify", verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to modify this booking" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Cannot modify a cancelled booking" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    // Check overlapping with other bookings
    const overlapping = await Booking.findOne({
      _id: { $ne: req.params.id },
      car: booking.car,
      status: { $ne: "cancelled" },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ message: "Car is already booked for these dates" });
    }

    const car = await Car.findById(booking.car);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * car.dailyPrice;

    booking.startDate = start;
    booking.endDate = end;
    booking.totalPrice = totalPrice;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("car", "model imageURL dailyPrice")
      .populate("user", "name email");

    res.json({ message: "Booking modified successfully", booking: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
