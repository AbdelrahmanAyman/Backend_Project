const Order = require("../models/Order");

const ACTIVE_STATUSES = ["confirmed", "preparing", "baking", "out_for_delivery"];

const createOrder = async (req, res) => {   // make a new order
  try {
    const { items, address, payment } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ status: "fail", message: "Order must contain at least one item" });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      address,
      payment,
      total,
      status: "confirmed",
      step: 0,
    });

    res.status(201).json({ status: "success", message: "Order placed", data: { order } });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getMyOrders = async (req, res) => {   // view the orders made by users
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    const orderHistory = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));
    
    const countedOrders = orders.filter((o) => o.status !== "cancelled");
    const totalSpent = countedOrders.reduce((sum, o) => sum + o.total, 0);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalOrders: countedOrders.length,
          totalSpent: Math.round(totalSpent * 100) / 100,
          activeOrders: activeOrders.length,
        },
        activeOrders,
        orderHistory,
      },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const cancelOrder = async (req, res) => {   // canceling the order 
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ status: "fail", message: "Order not found" });
    }

    if (!ACTIVE_STATUSES.includes(order.status)) {
      return res.status(400).json({
        status: "fail",
        message: "This order can no longer be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      status: "success",
      message: "Order cancelled",
      data: { order },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const markDelivered = async (req, res) => {   // mark that the order is delivered (by admins only)
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ status: "fail", message: "Order not found" });
    }

    if (!ACTIVE_STATUSES.includes(order.status)) {
      return res.status(400).json({
        status: "fail",
        message: "This order is already closed out",
      });
    }

    order.status = "delivered";
    await order.save();

    res.status(200).json({
      status: "success",
      message: "Order marked as delivered",
      data: { order },
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const getAllOrders = async (req, res) => {    // view all orders for all users (by admins only)
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", count: orders.length, data: { orders } });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = { getMyOrders, cancelOrder, createOrder, markDelivered, getAllOrders };