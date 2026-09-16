const express = require("express");
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimiter");
const { loginSchema } = require("../validators/auth.validator");
const { login } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", authLimiter, validate(loginSchema), login);

module.exports = router;
