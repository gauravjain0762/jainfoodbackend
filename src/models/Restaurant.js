const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    cuisines: [{ type: String }],
    logoUrl: { type: String },
    coverImageUrl: { type: String },
    address: {
      addressLine1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      },
    },
    contactPhone: { type: String },
    openingHours: [
      {
        day: { type: Number, min: 0, max: 6 }, // 0 = Sunday
        openTime: String, // "09:00"
        closeTime: String, // "22:00"
      },
    ],
    isOpen: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    estimatedDeliveryTime: { type: Number, default: 30 }, // minutes
  },
  { timestamps: true }
);

restaurantSchema.index({ "address.location": "2dsphere" });
restaurantSchema.index({ name: "text", cuisines: "text" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
