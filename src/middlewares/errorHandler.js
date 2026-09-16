const env = require("../config/env");
const logger = require("../utils/logger");
const ApiError = require("../utils/ApiError");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let { statusCode, message, details } = err;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field: ${err.path}`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already in use` : "Duplicate field value";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  statusCode = statusCode || 500;
  message = message || "Internal server error";

  if (!(err instanceof ApiError) && statusCode === 500) {
    logger.error(err.stack || err.message || String(err));
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: details || undefined,
    stack: env.isProd ? undefined : err.stack,
  });
}

module.exports = errorHandler;
