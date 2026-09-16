const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    imageUrl: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true }, // e.g. Starters, Main Course, Desserts
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    customizations: [
      {
        name: { type: String, required: true }, // e.g. "Size", "Toppings"
        options: [
          {
            label: { type: String, required: true },
            priceDelta: { type: Number, default: 0 },
          },
        ],
        required: { type: Boolean, default: false },
        multiSelect: { type: Boolean, default: false },
      },
    ],
    tags: [{ type: String }], // e.g. bestseller, spicy
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, category: 1 });
menuItemSchema.index({ name: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
