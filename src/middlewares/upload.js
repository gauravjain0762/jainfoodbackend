const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Folder and transform are fixed, never built from user input, to avoid
// passing attacker-controlled strings into Cloudinary API parameters.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "food2/dishes",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
