const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy", timestamp: new Date().toISOString() });
});

router.use("/auth", require("./auth.routes"));
router.use("/dishes", require("./dish.routes"));
router.use("/orders", require("./order.routes"));

module.exports = router;
