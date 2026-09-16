const cloudinary = require("cloudinary").v2;
const env = require("./env");
const logger = require("../utils/logger");

if (env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: env.cloudinary.cloudName,
    api_key: env.cloudinary.apiKey,
    api_secret: env.cloudinary.apiSecret,
  });
} else {
  logger.warn("Cloudinary credentials are not set — dish image uploads will fail until configured");
}

module.exports = cloudinary;
