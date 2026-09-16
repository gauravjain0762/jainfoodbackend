const cloudinary = require("../config/cloudinary");
const logger = require("./logger");

async function destroyImages(publicIds = []) {
  await Promise.all(
    publicIds.filter(Boolean).map((id) =>
      cloudinary.uploader.destroy(id).catch((err) => {
        logger.warn(`Failed to delete Cloudinary asset ${id}: ${err.message}`);
      })
    )
  );
}

module.exports = { destroyImages };
