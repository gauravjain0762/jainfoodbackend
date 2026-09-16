const nodemailer = require("nodemailer");
const env = require("./env");
const logger = require("../utils/logger");

let transporter = null;

if (env.smtp.host && env.smtp.user && env.smtp.pass) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
} else {
  logger.warn("SMTP credentials are not set — admin order emails will not be sent");
}

module.exports = transporter;
