const transporter = require("../config/mailer");
const env = require("../config/env");
const logger = require("../utils/logger");
const escapeHtml = require("../utils/escapeHtml");

async function sendOrderNotification(order) {
  if (!transporter || !env.adminNotifyEmail) {
    logger.warn(`Skipped order email for ${order.orderNumber} — SMTP or ADMIN_NOTIFY_EMAIL not configured`);
    return;
  }

  const itemRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 10px;border:1px solid #ddd">${escapeHtml(item.name)}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${item.qty}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right">₹${item.unitPrice}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right">₹${item.lineTotal}</td>
        </tr>`
    )
    .join("");

  const mismatchNote = order.priceMismatch
    ? `<p style="color:#b91c1c"><strong>Note:</strong> the total shown on the site at checkout did not match the current dish prices — the amount below is the correct, server-calculated total.</p>`
    : "";

  const html = `
    <h2>New Order Request — ${order.orderNumber}</h2>
    <p><strong>Customer:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.mobile)})</p>
    <p><strong>Delivery Address:</strong> ${escapeHtml(order.deliveryAddress)}</p>
    <p><strong>Members:</strong> ${order.members}</p>
    <p><strong>Delivery Date/Time:</strong> ${order.deliveryDate.toISOString().slice(0, 10)} at ${order.deliveryTime}</p>
    ${order.specialRequest ? `<p><strong>Special Request:</strong> ${escapeHtml(order.specialRequest)}</p>` : ""}
    <table style="border-collapse:collapse;margin-top:12px">
      <thead>
        <tr>
          <th style="padding:6px 10px;border:1px solid #ddd">Item</th>
          <th style="padding:6px 10px;border:1px solid #ddd">Qty</th>
          <th style="padding:6px 10px;border:1px solid #ddd">Price</th>
          <th style="padding:6px 10px;border:1px solid #ddd">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    <p style="margin-top:12px"><strong>Subtotal: ₹${order.subtotal}</strong></p>
    ${mismatchNote}
  `;

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to: env.adminNotifyEmail,
      subject: `New Order Request from ${order.customerName} — ${order.orderNumber}`,
      html,
    });
  } catch (err) {
    logger.error(`Failed to send order notification email: ${err.message}`);
  }
}

module.exports = { sendOrderNotification };
