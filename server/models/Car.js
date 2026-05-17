const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    dailyPrice: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    registrationNumber: { type: String, required: true, unique: true },
    features: { type: [String], default: [] },
    description: { type: String, default: "" },
    bookingCount: { type: Number, default: 0 },
    imageURL: { type: String, default: "" },
    location: { type: String, default: "" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
