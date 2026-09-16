const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Order = require("../models/Order");
const Dish = require("../models/Dish");
const { sendOrderNotification } = require("../services/mail.service");

function generateOrderNumber() {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

const createOrder = asyncHandler(async (req, res) => {
  const {
    customerName,
    mobile,
    deliveryAddress,
    members,
    deliveryDate,
    deliveryTime,
    specialRequest,
    items,
    subtotal: submittedSubtotal,
  } = req.body;

  const dishes = await Dish.find({ slug: { $in: items.map((i) => i.dishId) } });
  const dishBySlug = new Map(dishes.map((d) => [d.slug, d]));

  // Never trust client-submitted name/unitPrice for billing — re-price every
  // line from the current Dish record.
  const resolvedItems = items.map((item) => {
    const dish = dishBySlug.get(item.dishId);
    if (!dish) {
      throw ApiError.badRequest(`Dish not found: ${item.dishId}`);
    }
    if (!dish.available) {
      throw ApiError.badRequest(`"${dish.name}" is currently unavailable`);
    }
    return {
      dishId: dish.slug,
      name: dish.name,
      qty: item.qty,
      unitPrice: dish.price,
      lineTotal: dish.price * item.qty,
    };
  });

  const subtotal = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const priceMismatch = Math.abs(subtotal - submittedSubtotal) > 0.01;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customerName,
    mobile,
    deliveryAddress,
    members,
    deliveryDate: new Date(deliveryDate),
    deliveryTime,
    specialRequest: specialRequest || "",
    items: resolvedItems,
    subtotal,
    submittedSubtotal,
    priceMismatch,
  });

  // Best-effort — a slow/broken mail provider should never fail the order.
  sendOrderNotification(order).catch(() => {});

  new ApiResponse(201, order.toPublicJSON(), "Order placed successfully").send(res);
});

const listOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(filter),
  ]);

  new ApiResponse(200, {
    orders: orders.map((o) => o.toPublicJSON()),
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  }).send(res);
});

const getOrderByNumber = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) throw ApiError.notFound("Order not found");
  new ApiResponse(200, order.toPublicJSON()).send(res);
});

module.exports = { createOrder, listOrders, getOrderByNumber };
