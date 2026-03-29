import { NextRequest, NextResponse } from "next/server";
import { getActiveSubscribers } from "@/lib/subscribers";
import { sendEmailReminder, sendSmsReminder } from "@/lib/notifications";

// This endpoint is meant to be called by a weekly cron job.
// Protect it with a secret header so only your scheduler can trigger it.
//
// Vercel Cron example (vercel.json):
//   { "crons": [{ "path": "/api/send-reminders", "schedule": "0 9 * * 1" }] }
//
// Or any HTTP cron service (cron-job.org, GitHub Actions, etc.) that sends:
//   POST /api/send-reminders
//   Authorization: Bearer <CRON_SECRET>

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const subscribers = getActiveSubscribers();
  const results = { email: 0, sms: 0, errors: 0 };

  await Promise.allSettled(
    subscribers.map(async (sub) => {
      try {
        if (sub.email) {
          await sendEmailReminder(sub);
          results.email++;
        }
        if (sub.phone) {
          await sendSmsReminder(sub);
          results.sms++;
        }
      } catch (err) {
        console.error(`Reminder failed for subscriber ${sub.id}:`, err);
        results.errors++;
      }
    })
  );

  console.log(
    `Reminders sent — email: ${results.email}, sms: ${results.sms}, errors: ${results.errors}`
  );

  return NextResponse.json({
    success: true,
    sent: results,
    total: subscribers.length,
  });
}

// Also support GET so Vercel Cron (which sends GET) works out of the box
export { POST as GET };
