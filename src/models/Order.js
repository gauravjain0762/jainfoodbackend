const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    dishId: { type: String, required: true }, // Dish slug
    name: { type: String, required: true }, // snapshot at order time
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }, // live price at order time
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    deliveryAddress: { type: String, required: true, trim: true },
    members: { type: Number, required: true, min: 1 },
    deliveryDate: { type: Date, required: true },
    deliveryTime: { type: String, required: true }, // 24h "HH:mm"
    specialRequest: { type: String, trim: true, default: "" },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 }, // server-calculated, source of truth
    submittedSubtotal: { type: Number, required: true, min: 0 }, // what the frontend displayed
    priceMismatch: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

orderSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    orderNumber: this.orderNumber,
    customerName: this.customerName,
    mobile: this.mobile,
    deliveryAddress: this.deliveryAddress,
    members: this.members,
    deliveryDate: this.deliveryDate.toISOString().slice(0, 10),
    deliveryTime: this.deliveryTime,
    specialRequest: this.specialRequest,
    items: this.items,
    subtotal: this.subtotal,
    status: this.status,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Order", orderSchema);
