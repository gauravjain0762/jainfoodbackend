const env = require("./src/config/env");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");
const app = require("./src/app");

let server;

connectDB().then(() => {
  server = app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
