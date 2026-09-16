const nodemailer = require("nodemailer");
const env = require("./env");
const logger = require("../utils/logger");

let transporter = null;

if (env.email.user && env.email.pass) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.email.user, pass: env.email.pass },
  });
} else {
  logger.warn("EMAIL_USER/EMAIL_PASS are not set — admin order emails will not be sent");
}

module.exports = transporter;
