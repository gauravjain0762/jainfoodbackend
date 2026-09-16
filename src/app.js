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

// Auth is Bearer-token based (no cookies), so there's no credentialed-request
// risk in allowing any origin — open CORS is standard for token APIs.
app.use(cors());
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
