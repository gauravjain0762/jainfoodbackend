const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy", timestamp: new Date().toISOString() });
});

router.use("/auth", require("./auth.routes"));
router.use("/dishes", require("./dish.routes"));

// Feature routers get mounted here as they're built, e.g.:
// router.use("/restaurants", require("./restaurant.routes"));
// router.use("/orders", require("./order.routes"));
// router.use("/cart", require("./cart.routes"));
// router.use("/reviews", require("./review.routes"));

module.exports = router;
