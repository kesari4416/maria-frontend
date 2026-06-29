import { getBranch, COMMON } from "@/lib/branches";

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

const buildInitial = (client, location) => {
  const b = getBranch(location);
  return `Hello ${client || "there"},

Thank you for contacting *${COMPANY}*! 😊

Our field team has visited your site and noted your requirements. We are currently preparing your quotation and will share it with you shortly, along with the next steps.

📍 *${b.branch}*

${b.address}

📞 Mobile: ${b.mobile}

📍 Location: ${b.mapLink}

📸 Instagram: ${COMMON.instagram}

If you have any urgent queries, please feel free to contact us at ${COMMON.urgentMobile}.

Thank you for choosing ${COMPANY}. We look forward to serving you!

Warm regards,
Team ${COMPANY}`;
};

const buildStatus = (client, location, headline) => {
  const b = getBranch(location);
  return `Hello ${client || "there"},

${headline}

📍 *${b.branch}*

${b.address}

📞 Mobile: ${b.mobile}
📞 Urgent: ${COMMON.urgentMobile}

📸 Instagram: ${COMMON.instagram}

Warm regards,
Team ${COMPANY}`;
};

const STATUS_HEADLINE = {
  "Materials Delivered": `This is *${COMPANY}*. Your materials have been delivered to your site today. ✅ Please verify and let us know if anything is missing.`,
  "Work in Progress": `Update from *${COMPANY}*: work at your site is in progress. 🛠️ We will keep you posted on every stage.`,
  "Completed": `Great news! Your project with *${COMPANY}* is now complete. ✨ Thank you for trusting us with your space.`,
  "On Hold": `This is *${COMPANY}*. Work at your site is temporarily on hold. Our team will reach out to you shortly with details.`,
  "Cancelled": `This is *${COMPANY}* regarding your project. We have noted a cancellation — please call us so we can confirm and assist you further.`,
};

export function whatsappLink({ mobile, client_name, status, location }) {
  const num = normalizeWhatsApp(mobile);
  if (!num) return null;
  let body;
  if (!status || status === "initial" || status === "Site Visited") {
    body = buildInitial(client_name, location);
  } else if (STATUS_HEADLINE[status]) {
    body = buildStatus(client_name, location, STATUS_HEADLINE[status]);
  } else {
    body = buildInitial(client_name, location);
  }
  return `https://wa.me/${num}?text=${encodeURIComponent(body)}`;
}
