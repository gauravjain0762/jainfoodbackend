const ROLES = Object.freeze({
  CUSTOMER: "customer",
  RESTAURANT_OWNER: "restaurant_owner",
  DELIVERY_PARTNER: "delivery_partner",
  ADMIN: "admin",
});

const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY_FOR_PICKUP: "ready_for_pickup",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
});

const PAYMENT_METHOD = Object.freeze({
  CASH_ON_DELIVERY: "cod",
  CARD: "card",
  UPI: "upi",
  WALLET: "wallet",
});

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
});

module.exports = { ROLES, ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD, HTTP_STATUS };
