const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    size: { type: String, trim: true },
    toppings: { type: [String], default: [] },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "Order must contain at least one item"],
    },
    status: {
      type: String,
      enum: ["confirmed", "preparing", "baking", "out_for_delivery", "delivered", "cancelled"],
      default: "confirmed",
    },
    step: { type: Number, default: 0 },
    eta: { type: String, trim: true },
    address: { type: String, trim: true },
    payment: { type: String, trim: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;