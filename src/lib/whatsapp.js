// Normalize phone numbers to E.164-like format for wa.me (no +, no spaces)
// India default country code = 91 if missing.
export function normalizeWhatsApp(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D+/g, "");
  if (!d) return null;
  if (d.length === 10) d = "91" + d;            // 9994611220 -> 919994611220
  else if (d.length === 11 && d.startsWith("0")) d = "91" + d.slice(1); // 09994611220 -> 919994611220
  else if (d.length === 12 && d.startsWith("91")) {/* already prefixed */}
  return d;
}

const COMPANY = "Maria Glass & Plywood";
const PHONE = "+91 99946 11220";

const MESSAGES = {
  initial: (client) =>
`Hello ${client || "there"},

Thank you for contacting *${COMPANY}*! 🙏

Our field team has just visited your site and noted your requirements. We will share the quote and next steps shortly.

For any urgent queries, please call ${PHONE}.

— Team ${COMPANY}`,

  "Materials Delivered": (client) =>
`Hello ${client || "there"},

This is *${COMPANY}*. Your materials have been delivered to your site today. ✅

Please verify and let us know if anything is missing. Our team is happy to assist.

Call: ${PHONE}

— Team ${COMPANY}`,

  "Work in Progress": (client) =>
`Hello ${client || "there"},

Update from *${COMPANY}*: work at your site is in progress. 🛠️

We will keep you posted on every stage. For any questions, please call ${PHONE}.

— Team ${COMPANY}`,

  "Completed": (client) =>
`Hello ${client || "there"},

Great news! Your project with *${COMPANY}* is now complete. ✨

Thank you for trusting us with your space. We would love your feedback — and your referrals!

Call: ${PHONE}

— Team ${COMPANY}`,

  "On Hold": (client) =>
`Hello ${client || "there"},

This is *${COMPANY}*. Work at your site is temporarily on hold. Our team will reach out to you shortly with details.

For immediate queries, please call ${PHONE}.

— Team ${COMPANY}`,

  "Cancelled": (client) =>
`Hello ${client || "there"},

This is *${COMPANY}* regarding your project. We have noted a cancellation. Please call ${PHONE} so we can confirm and assist you further.

— Team ${COMPANY}`,
};

export function whatsappLink({ mobile, client_name, status }) {
  const num = normalizeWhatsApp(mobile);
  if (!num) return null;
  const builder = (status && MESSAGES[status]) || MESSAGES.initial;
  const text = encodeURIComponent(builder(client_name));
  return `https://wa.me/${num}?text=${text}`;
}
