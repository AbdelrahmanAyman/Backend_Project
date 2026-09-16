const express = require("express");
const orderController = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/auth");
const router = express.Router();

router.use(protect);

router.get("/me", orderController.getMyOrders);
router.post("/", orderController.createOrder);
router.patch("/:id/cancel", orderController.cancelOrder);
router.patch("/:id/deliver", restrictTo("admin"), orderController.markDelivered);
router.get("/", restrictTo("admin"), orderController.getAllOrders);

module.exports = router;