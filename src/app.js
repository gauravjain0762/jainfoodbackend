const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimiter");

const app = express();

app.use(helmet());

const allowAnyOrigin = env.clientUrls.includes("*");

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = same-origin, server-to-server, curl, mobile apps — always allow.
      if (!origin || allowAnyOrigin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }
      const err = new Error(`Origin ${origin} is not allowed by CORS`);
      err.statusCode = 403;
      return callback(err);
    },
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

if (!env.isProd) {
  app.use(morgan("dev"));
}

app.use("/api/v1", apiLimiter, routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
