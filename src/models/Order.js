const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } = require("../constants");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true }, // snapshot at order time
    price: { type: Number, required: true }, // snapshot at order time
    quantity: { type: Number, required: true, min: 1 },
    selectedCustomizations: [
      {
        name: String,
        options: [String],
      },
    ],
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: Object.values(ORDER_STATUS), required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [orderItemSchema], required: true },
    deliveryAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    itemsTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, enum: Object.values(PAYMENT_METHOD), required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
    statusHistory: [statusHistorySchema],
    specialInstructions: { type: String },
    cancelledReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });
orderSchema.index({ deliveryPartner: 1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);
