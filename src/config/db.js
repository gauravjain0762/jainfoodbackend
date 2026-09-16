const dns = require("dns");
const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

mongoose.set("strictQuery", true);

// Node's built-in resolver (c-ares) can fail SRV lookups on some Windows
// networks (ECONNREFUSED) even though the OS resolver handles them fine.
// Pointing it at a public DNS server works around that.
if (env.mongoUri.startsWith("mongodb+srv://")) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

async function connectDB() {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
}

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

module.exports = connectDB;
