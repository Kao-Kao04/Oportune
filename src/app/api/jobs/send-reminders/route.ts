import { connection } from "next/server";
import { sendReminders } from "@/lib/jobs/send-reminders";
import { isAuthorizedCron, runJob } from "@/lib/jobs/run";

// Scheduled in vercel.json; protected by CRON_SECRET.
export const maxDuration = 60;

export async function GET(request: Request) {
  await connection();
  if (!isAuthorizedCron(request)) return new Response("Unauthorized", { status: 401 });
  return runJob("send_reminders", sendReminders);
}
