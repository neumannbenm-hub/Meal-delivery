import { Resend } from "resend";
import twilio from "twilio";
import { getDinners } from "@/lib/meals";
import { formatPrice } from "@/lib/utils";
import type { Subscriber } from "@/lib/subscribers";

// ─── Clients (lazily initialised to avoid crashing if env vars absent) ───────

function getResend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
  return new Resend(process.env.RESEND_API_KEY);
}

function getTwilio() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN)
    throw new Error("Twilio credentials not set");
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function currentWeekLabel(): string {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" });
  return `${fmt.format(monday)} – ${fmt.format(sunday)}, ${sunday.getFullYear()}`;
}

// ─── Email template ───────────────────────────────────────────────────────────

function buildEmailHtml(subscriber: Subscriber): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const weekLabel = currentWeekLabel();
  const dinners = getDinners().slice(0, 3);

  const mealRows = dinners
    .map(
      (meal) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f5f5f4;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:20px;color:#f97316;font-size:18px;vertical-align:top;padding-top:2px;">•</td>
              <td>
                <strong style="color:#1c1917;font-size:15px;">${meal.name}</strong>
                ${meal.dayOfWeek ? `<span style="color:#a8a29e;font-size:13px;margin-left:8px;">${meal.dayOfWeek}</span>` : ""}
                <br>
                <span style="color:#78716c;font-size:13px;">${meal.description.slice(0, 90)}…</span>
              </td>
              <td style="text-align:right;white-space:nowrap;padding-left:16px;color:#f97316;font-weight:700;font-size:14px;vertical-align:top;padding-top:2px;">
                From ${formatPrice(meal.pricing.serves1)}
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  const greeting = subscriber.name ? `Hi ${subscriber.name}! 👋` : "Hi there! 👋";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>This week's FreshTable menu is live</title>
</head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafaf9;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e7e5e4;">

          <!-- Header -->
          <tr>
            <td style="background:#f97316;padding:28px 32px;">
              <p style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">🍽 FreshTable</p>
              <p style="margin:6px 0 0;color:#fff7ed;font-size:14px;">Your weekly menu reminder</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;color:#1c1917;font-size:20px;font-weight:700;">This week's menu is live!</p>
              <p style="margin:0 0 24px;color:#78716c;font-size:14px;">Week of ${weekLabel}</p>

              <p style="margin:0 0 24px;color:#44403c;font-size:15px;line-height:1.65;">
                ${greeting}<br><br>
                A fresh week of chef-crafted meals is ready. Here's a taste of what's on the dinner menu — plus breakfast and lunch add-ons.
              </p>

              <!-- Featured dinners -->
              <p style="margin:0 0 12px;color:#1c1917;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Featured Dinners</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${mealRows}
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
                <tr>
                  <td align="center">
                    <a href="${baseUrl}"
                       style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 36px;border-radius:999px;">
                      View Full Menu &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;color:#a8a29e;font-size:13px;line-height:1.6;">
                Orders close <strong>Sunday at midnight</strong>. Delivery runs Monday through Thursday.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f4;border-top:1px solid #e7e5e4;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#a8a29e;font-size:12px;line-height:1.6;">
                You're receiving this because you opted in to weekly reminders.<br>
                <a href="${baseUrl}/unsubscribe?token=${subscriber.unsubscribeToken}"
                   style="color:#f97316;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Public send functions ────────────────────────────────────────────────────

export async function sendEmailReminder(subscriber: Subscriber): Promise<void> {
  if (!subscriber.email) return;

  const fromAddress =
    process.env.REMINDER_FROM_EMAIL ?? "FreshTable <noreply@yourdomain.com>";

  await getResend().emails.send({
    from: fromAddress,
    to: subscriber.email,
    subject: `🍽 This week's FreshTable menu is live — ${currentWeekLabel()}`,
    html: buildEmailHtml(subscriber),
  });
}

export async function sendSmsReminder(subscriber: Subscriber): Promise<void> {
  if (!subscriber.phone) return;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const body =
    `FreshTable: This week's menu is live! 7 dinners + add-ons ready to order. ` +
    `Order now: ${baseUrl} | Stop: ${baseUrl}/unsubscribe?token=${subscriber.unsubscribeToken}`;

  await getTwilio().messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: subscriber.phone,
  });
}
