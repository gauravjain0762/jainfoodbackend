const Joi = require("joi");

const orderItemSchema = Joi.object({
  dishId: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  qty: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().min(0).required(), // display snapshot only — never trusted for billing
});

const createOrderSchema = Joi.object({
  customerName: Joi.string().trim().min(2).max(100).required(),
  mobile: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({ "string.pattern.base": "Enter a valid 10-digit mobile number" }),
  deliveryAddress: Joi.string().trim().min(5).max(300).required(),
  members: Joi.number().integer().min(1).max(500).required(),
  deliveryDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({ "string.pattern.base": "deliveryDate must be in YYYY-MM-DD format" }),
  deliveryTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required()
    .messages({ "string.pattern.base": "deliveryTime must be in 24-hour HH:mm format" }),
  specialRequest: Joi.string().trim().max(500).allow("", null),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  subtotal: Joi.number().min(0).required(),
});

module.exports = { createOrderSchema };
