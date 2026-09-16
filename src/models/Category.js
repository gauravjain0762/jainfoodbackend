const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

categorySchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this.slug,
    name: this.name,
  };
};

module.exports = mongoose.model("Category", categorySchema);
