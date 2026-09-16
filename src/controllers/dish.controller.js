const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Dish = require("../models/Dish");
const { generateUniqueSlug } = require("../services/dish.service");
const { destroyImages } = require("../utils/cloudinaryHelpers");

const DISH_FIELDS = [
  "name",
  "category",
  "desc",
  "price",
  "strikePrice",
  "rating",
  "reviewsCount",
  "spiceLevel",
  "isJain",
  "tag",
  "available",
  "sections",
];

const createDish = asyncHandler(async (req, res) => {
  const imageFile = req.files?.image?.[0];
  if (!imageFile) {
    throw ApiError.badRequest("A primary 'image' file is required");
  }
  const galleryFiles = req.files?.images || [];

  const slug = await generateUniqueSlug(req.body.name);

  const dish = await Dish.create({
    ...Object.fromEntries(DISH_FIELDS.map((f) => [f, req.body[f]]).filter(([, v]) => v !== undefined)),
    slug,
    image: { url: imageFile.path, publicId: imageFile.filename },
    images: galleryFiles.map((f) => ({ url: f.path, publicId: f.filename })),
    createdBy: req.user._id,
  });

  new ApiResponse(201, dish.toPublicJSON(), "Dish created successfully").send(res);
});

const listDishes = asyncHandler(async (req, res) => {
  const { category, section, isJain, available, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (section) filter.sections = section;
  if (isJain !== undefined) filter.isJain = isJain === "true";
  if (available !== undefined) filter.available = available === "true";
  if (search) filter.$text = { $search: search };

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [dishes, total] = await Promise.all([
    Dish.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Dish.countDocuments(filter),
  ]);

  new ApiResponse(200, {
    dishes: dishes.map((d) => d.toPublicJSON()),
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  }).send(res);
});

const getDishBySlug = asyncHandler(async (req, res) => {
  const dish = await Dish.findOne({ slug: req.params.slug });
  if (!dish) throw ApiError.notFound("Dish not found");
  new ApiResponse(200, dish.toPublicJSON()).send(res);
});

const updateDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findOne({ slug: req.params.slug });
  if (!dish) throw ApiError.notFound("Dish not found");

  for (const field of DISH_FIELDS) {
    if (req.body[field] !== undefined) dish[field] = req.body[field];
  }

  const newImageFile = req.files?.image?.[0];
  if (newImageFile) {
    await destroyImages([dish.image.publicId]);
    dish.image = { url: newImageFile.path, publicId: newImageFile.filename };
  }

  const newGalleryFiles = req.files?.images || [];
  if (newGalleryFiles.length > 0) {
    await destroyImages(dish.images.map((img) => img.publicId));
    dish.images = newGalleryFiles.map((f) => ({ url: f.path, publicId: f.filename }));
  }

  await dish.save();
  new ApiResponse(200, dish.toPublicJSON(), "Dish updated successfully").send(res);
});

const updateAvailability = asyncHandler(async (req, res) => {
  const dish = await Dish.findOneAndUpdate(
    { slug: req.params.slug },
    { available: req.body.available },
    { new: true }
  );
  if (!dish) throw ApiError.notFound("Dish not found");

  const message = `Dish marked ${req.body.available ? "active" : "inactive"}`;
  new ApiResponse(200, dish.toPublicJSON(), message).send(res);
});

const deleteDish = asyncHandler(async (req, res) => {
  const dish = await Dish.findOne({ slug: req.params.slug });
  if (!dish) throw ApiError.notFound("Dish not found");

  await destroyImages([dish.image.publicId, ...dish.images.map((img) => img.publicId)]);
  await dish.deleteOne();

  new ApiResponse(200, null, "Dish deleted successfully").send(res);
});

module.exports = {
  createDish,
  listDishes,
  getDishBySlug,
  updateDish,
  updateAvailability,
  deleteDish,
};
