const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    selectedCustomizations: [
      {
        name: String,
        options: [String],
      },
    ],
    priceAtAdd: { type: Number, required: true },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
