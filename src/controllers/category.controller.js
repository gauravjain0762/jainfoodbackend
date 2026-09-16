const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Category = require("../models/Category");
const slugify = require("../utils/slugify");

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name);

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw ApiError.conflict(`Category "${existing.name}" already exists`);
  }

  const category = await Category.create({ name, slug });
  new ApiResponse(201, category.toPublicJSON(), "Category created successfully").send(res);
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  new ApiResponse(200, { categories: categories.map((c) => c.toPublicJSON()) }).send(res);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOneAndDelete({ slug: req.params.slug });
  if (!category) throw ApiError.notFound("Category not found");
  new ApiResponse(200, null, "Category deleted successfully").send(res);
});

module.exports = { createCategory, listCategories, deleteCategory };
