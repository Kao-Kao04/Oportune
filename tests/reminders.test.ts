import { describe, expect, it } from "vitest";
import { planReminders, reminderSubject, reminderTargets, runDates, type SavedForReminder } from "../src/lib/reminders/plan";

const TODAY = "2026-10-23";

describe("runDates", () => {
  it("covers just today on a normal day or the first run", () => {
    expect(runDates(TODAY, "2026-10-22")).toEqual([TODAY]);
    expect(runDates(TODAY, null)).toEqual([TODAY]);
    expect(runDates(TODAY, TODAY)).toEqual([TODAY]);
  });

  it("catches up on missed days, at most a week", () => {
    expect(runDates(TODAY, "2026-10-20")).toEqual(["2026-10-21", "2026-10-22", "2026-10-23"]);
    expect(runDates(TODAY, "2026-09-01")).toHaveLength(7);
  });
});

describe("reminderTargets", () => {
  it("targets deadlines 7 days and 1 day out", () => {
    expect(reminderTargets([TODAY], TODAY)).toEqual([
      { type: "deadline_7d", deadline: "2026-10-30" },
      { type: "deadline_1d", deadline: "2026-10-24" },
    ]);
  });

  it("skips deadlines that already passed when catching up", () => {
    const targets = reminderTargets(["2026-10-21", TODAY], TODAY);
    expect(targets).not.toContainEqual({ type: "deadline_1d", deadline: "2026-10-22" });
    expect(targets).toContainEqual({ type: "deadline_7d", deadline: "2026-10-28" });
  });

  it("crosses month ends", () => {
    expect(reminderTargets(["2026-10-28"], "2026-10-28")[0]).toEqual({ type: "deadline_7d", deadline: "2026-11-04" });
  });
});

describe("planReminders", () => {
  const saved = (o: Partial<SavedForReminder> = {}): SavedForReminder => ({
    userId: "u1",
    opportunityId: "o1",
    deadline: "2026-10-30",
    emailEnabled: true,
    pushEnabled: true,
    hasPushSubscription: true,
    ...o,
  });
  const targets = reminderTargets([TODAY], TODAY);

  it("plans one per enabled channel, push first", () => {
    const plan = planReminders(targets, [saved()], { email: true, push: true });
    expect(plan.map((p) => [p.channel, p.type])).toEqual([
      ["push", "deadline_7d"],
      ["email", "deadline_7d"],
    ]);
    expect(plan[1].deduplicationKey).toBe("u1:o1:deadline_7d:email:2026-10-30");
  });

  it("respects student settings and missing push subscriptions", () => {
    expect(planReminders(targets, [saved({ emailEnabled: false, hasPushSubscription: false })], { email: true, push: true })).toEqual([]);
  });

  it("skips channels that aren't configured on the server", () => {
    const plan = planReminders(targets, [saved()], { email: false, push: true });
    expect(plan.map((p) => p.channel)).toEqual(["push"]);
  });

  it("gives an extended deadline a new key", () => {
    const before = planReminders(targets, [saved()], { email: true, push: false })[0].deduplicationKey;
    const later = reminderTargets(["2026-10-30"], "2026-10-30");
    const after = planReminders(later, [saved({ deadline: "2026-11-06" })], { email: true, push: false })[0].deduplicationKey;
    expect(after).not.toBe(before);
  });

  it("ignores saved listings with other deadlines", () => {
    expect(planReminders(targets, [saved({ deadline: "2026-11-20" })], { email: true, push: true })).toEqual([]);
  });
});

describe("reminderSubject", () => {
  it("words the subject by days left", () => {
    expect(reminderSubject("deadline_7d", 7, "X")).toBe("Closes in a week: X");
    expect(reminderSubject("deadline_7d", 6, "X")).toBe("Closes in 6 days: X");
    expect(reminderSubject("deadline_1d", 1, "X")).toBe("Closes tomorrow: X");
  });
});
