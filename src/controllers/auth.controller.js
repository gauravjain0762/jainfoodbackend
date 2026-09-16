const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");
const { signAccessToken, signRefreshToken } = require("../utils/token");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account is deactivated");
  }

  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  new ApiResponse(
    200,
    {
      user: user.toSafeObject(),
      accessToken,
      refreshToken,
    },
    "Login successful"
  ).send(res);
});

module.exports = { login };
