const slugify = require("../utils/slugify");
const Dish = require("../models/Dish");

async function generateUniqueSlug(name) {
  const base = slugify(name);
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-await-in-loop
  while (await Dish.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

module.exports = { generateUniqueSlug };
