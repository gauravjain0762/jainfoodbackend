const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
});

module.exports = { createCategorySchema };
