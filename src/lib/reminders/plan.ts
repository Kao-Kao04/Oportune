// Reminder planning (docs/system-design/04-api-and-logic.md §7.3). Pure
// functions so the rules are unit-tested; the job does the I/O.

export type ReminderType = "deadline_7d" | "deadline_1d";
export type Channel = "email" | "push";

const OFFSETS: Record<ReminderType, number> = { deadline_7d: 7, deadline_1d: 1 };

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Dates the job should cover: today, plus any days missed since the last
// successful run (at most a week back, so a long outage doesn't spam).
export function runDates(today: string, lastSuccessfulRun: string | null): string[] {
  if (!lastSuccessfulRun || lastSuccessfulRun >= today) return [today];
  const dates: string[] = [];
  for (let d = addDays(lastSuccessfulRun, 1); d <= today; d = addDays(d, 1)) dates.push(d);
  return dates.slice(-7);
}

export type Target = { type: ReminderType; deadline: string };

// For each run date: listings due in 7 days and in 1 day. Deadlines already
// in the past (possible when catching up) are skipped.
export function reminderTargets(dates: string[], today: string): Target[] {
  const seen = new Set<string>();
  const targets: Target[] = [];
  for (const date of dates) {
    for (const type of Object.keys(OFFSETS) as ReminderType[]) {
      const deadline = addDays(date, OFFSETS[type]);
      const key = `${type}:${deadline}`;
      if (deadline < today || seen.has(key)) continue;
      seen.add(key);
      targets.push({ type, deadline });
    }
  }
  return targets;
}

export type SavedForReminder = {
  userId: string;
  opportunityId: string;
  deadline: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  hasPushSubscription: boolean;
};

export type PlannedReminder = {
  userId: string;
  opportunityId: string;
  type: ReminderType;
  channel: Channel;
  deadline: string;
  deduplicationKey: string;
};

export function deduplicationKey(r: Omit<PlannedReminder, "deduplicationKey">): string {
  return `${r.userId}:${r.opportunityId}:${r.type}:${r.channel}:${r.deadline}`;
}

// One reminder per saved listing, type, and enabled channel. The key includes
// the deadline, so an extended deadline gets fresh reminders while a re-run
// never sends twice. Push goes first (it doesn't count against email limits).
export function planReminders(
  targets: Target[],
  saved: SavedForReminder[],
  channels: { email: boolean; push: boolean },
): PlannedReminder[] {
  const planned: PlannedReminder[] = [];
  for (const target of targets) {
    for (const s of saved) {
      if (s.deadline !== target.deadline) continue;
      const enabled: Channel[] = [];
      if (channels.push && s.pushEnabled && s.hasPushSubscription) enabled.push("push");
      if (channels.email && s.emailEnabled) enabled.push("email");
      for (const channel of enabled) {
        const base = { userId: s.userId, opportunityId: s.opportunityId, type: target.type, channel, deadline: s.deadline };
        planned.push({ ...base, deduplicationKey: deduplicationKey(base) });
      }
    }
  }
  return planned.sort((a, b) => (a.channel === b.channel ? 0 : a.channel === "push" ? -1 : 1));
}

export function reminderSubject(type: ReminderType, daysLeft: number, title: string): string {
  if (daysLeft <= 0) return `Closes today: ${title}`;
  if (daysLeft === 1) return `Closes tomorrow: ${title}`;
  return type === "deadline_7d" && daysLeft === 7 ? `Closes in a week: ${title}` : `Closes in ${daysLeft} days: ${title}`;
}
