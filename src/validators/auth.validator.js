const Joi = require("joi");

// Not Joi.string().email() on purpose — admin login identifiers aren't
// necessarily real email addresses (e.g. "Admin@jainfood").
const loginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().required(),
});

module.exports = { loginSchema };
