const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAccessToken } = require("../utils/token");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Not authenticated");
  }

  const token = header.split(" ")[1];
  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }
  if (!user.isActive) {
    throw ApiError.forbidden("Account is deactivated");
  }

  req.user = user;
  next();
});

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Not authenticated");
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }
    next();
  };
}

module.exports = { protect, authorize };
