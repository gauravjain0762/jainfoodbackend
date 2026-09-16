const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const { ROLES } = require("../constants");
const validate = require("../middlewares/validate");
const { orderLimiter } = require("../middlewares/rateLimiter");
const { createOrderSchema } = require("../validators/order.validator");
const { createOrder, listOrders, getOrderByNumber } = require("../controllers/order.controller");

const router = express.Router();

// Public — no auth required
router.post("/", orderLimiter, validate(createOrderSchema), createOrder);

// Admin only
router.get("/", protect, authorize(ROLES.ADMIN), listOrders);
router.get("/:orderNumber", protect, authorize(ROLES.ADMIN), getOrderByNumber);

module.exports = router;
