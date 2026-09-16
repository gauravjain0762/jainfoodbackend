const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

addressSchema.index({ location: "2dsphere" });

module.exports = addressSchema;
