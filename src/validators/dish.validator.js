const Joi = require("joi");

const createDishSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  category: Joi.string().trim().min(2).max(80).required(),
  desc: Joi.string().trim().max(500).allow("", null),
  price: Joi.number().min(0).required(),
  strikePrice: Joi.number().min(0).allow(null, ""),
  rating: Joi.number().min(0).max(5),
  reviewsCount: Joi.number().integer().min(0),
  spiceLevel: Joi.string().valid("Mild", "Medium", "Spicy", "Extra Spicy"),
  isJain: Joi.boolean(),
  tag: Joi.string().trim().max(40).allow("", null),
  available: Joi.boolean(),
  sections: Joi.array().items(Joi.string().trim()).default([]),
});

const updateDishSchema = createDishSchema.fork(["name", "category", "price"], (schema) =>
  schema.optional()
);

const availabilitySchema = Joi.object({
  available: Joi.boolean().required(),
});

module.exports = { createDishSchema, updateDishSchema, availabilitySchema };
