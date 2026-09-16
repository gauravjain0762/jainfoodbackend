const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const { ROLES } = require("../constants");
const validate = require("../middlewares/validate");
const upload = require("../middlewares/upload");
const { createDishSchema, updateDishSchema, availabilitySchema } = require("../validators/dish.validator");
const {
  createDish,
  listDishes,
  getDishBySlug,
  updateDish,
  updateAvailability,
  deleteDish,
} = require("../controllers/dish.controller");

const router = express.Router();

// Admin panel sends "sections" as a JSON string or comma-separated list
// inside multipart form-data — normalize it to a real array before Joi runs.
function normalizeDishBody(req, res, next) {
  if (typeof req.body.sections === "string") {
    try {
      req.body.sections = JSON.parse(req.body.sections);
    } catch {
      req.body.sections = req.body.sections
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  next();
}

const imageFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);

// Public — no auth required
router.get("/", listDishes);
router.get("/:slug", getDishBySlug);

// Admin only
router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN),
  imageFields,
  normalizeDishBody,
  validate(createDishSchema),
  createDish
);
router.patch(
  "/:slug",
  protect,
  authorize(ROLES.ADMIN),
  imageFields,
  normalizeDishBody,
  validate(updateDishSchema),
  updateDish
);
router.patch(
  "/:slug/availability",
  protect,
  authorize(ROLES.ADMIN),
  validate(availabilitySchema),
  updateAvailability
);
router.delete("/:slug", protect, authorize(ROLES.ADMIN), deleteDish);

module.exports = router;
