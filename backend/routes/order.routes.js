const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middlware");
const OrderController = require("../controllers/order.controller");

// Create order
router.post("/api/orders", authMiddleware.verifyToken, OrderController.createOrder);

// Get all orders
router.get("/api/orders", authMiddleware.verifyToken, OrderController.getOrders);

// Get order by ID
router.get("/api/orders/:id", authMiddleware.verifyToken, OrderController.getOrderById);
// routes/order.route.js
router.put("/api/order-services/:id", authMiddleware.verifyToken, OrderController.updateOrderService);

module.exports = router;