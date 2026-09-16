const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    desc: { type: String, trim: true },
    image: { type: imageSchema, required: true },
    images: { type: [imageSchema], default: [] },
    price: { type: Number, required: true, min: 0 },
    strikePrice: { type: Number, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Spicy", "Extra Spicy"],
      default: "Mild",
    },
    isJain: { type: Boolean, default: false },
    tag: { type: String, trim: true },
    available: { type: Boolean, default: true },
    sections: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

dishSchema.index({ category: 1 });
dishSchema.index({ sections: 1 });
dishSchema.index({ name: "text", category: "text" });

dishSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.slug,
    name: this.name,
    category: this.category,
    desc: this.desc,
    image: this.image?.url,
    images: this.images.map((img) => img.url),
    price: this.price,
    strikePrice: this.strikePrice,
    rating: this.rating,
    reviewsCount: this.reviewsCount,
    spiceLevel: this.spiceLevel,
    isJain: this.isJain,
    tag: this.tag,
    available: this.available,
    sections: this.sections,
  };
};

module.exports = mongoose.model("Dish", dishSchema);
