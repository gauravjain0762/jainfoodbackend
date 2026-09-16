const express = require("express");
const { protect, authorize } = require("../middlewares/auth");
const { ROLES } = require("../constants");
const validate = require("../middlewares/validate");
const { createCategorySchema } = require("../validators/category.validator");
const { createCategory, listCategories, deleteCategory } = require("../controllers/category.controller");

const router = express.Router();

// Public — no auth required
router.get("/", listCategories);

// Admin only
router.post("/", protect, authorize(ROLES.ADMIN), validate(createCategorySchema), createCategory);
router.delete("/:slug", protect, authorize(ROLES.ADMIN), deleteCategory);

module.exports = router;
