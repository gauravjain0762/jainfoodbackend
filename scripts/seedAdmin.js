const mongoose = require("mongoose");
const env = require("../src/config/env");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const { ROLES } = require("../src/constants");
const logger = require("../src/utils/logger");

async function seedAdmin() {
  if (!env.admin.email || !env.admin.password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding");
  }

  await connectDB();

  const email = env.admin.email.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    logger.info(`Admin already exists: ${email}`);
  } else {
    await User.create({
      name: "Admin",
      email,
      password: env.admin.password,
      role: ROLES.ADMIN,
    });
    logger.info(`Admin created: ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
}

seedAdmin().catch((err) => {
  logger.error(`Seeding admin failed: ${err.message}`);
  process.exit(1);
});
