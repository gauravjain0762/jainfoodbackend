const ApiError = require("../utils/ApiError");

// Wraps a Joi schema so routes can do: validate(schema)
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      throw ApiError.badRequest("Validation failed", details);
    }

    req.body = value;
    next();
  };
}

module.exports = validate;
