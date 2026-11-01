import { describe, expect, it } from "vitest";
import { mapCsvRow } from "../src/lib/opportunities/csv-import";
import { ctftimeToRows, type CtftimeEvent } from "../src/lib/opportunities/ctftime";
import { feedUrl, icsToRows, parseIcs } from "../src/lib/opportunities/ics-feed";
import { parsePost } from "../src/lib/opportunities/post-text";

const NOW = new Date("2026-11-01T04:00:00Z"); // Nov 1, 12:00 PH time
const CATEGORIES = new Set(["Cybersecurity CTFs", "Hackathons and technical competitions"]);

describe("parsePost (paste-to-draft, Share to Oportune)", () => {
  const post = `📣 CALLING ALL STUDENT DEVELOPERS! 📣
HackPH 2026 is here! Open to all college students.
Register here: https://forms.gle/AbC123 until November 20, 2026.
Event proper: Dec 5. Details: https://www.facebook.com/hackph/posts/42.`;

  it("finds the title, the registration form, the post, and the deadline", () => {
    const parsed = parsePost(post, NOW);
    expect(parsed.title).toBe("CALLING ALL STUDENT DEVELOPERS!");
    expect(parsed.applicationUrl).toBe("https://forms.gle/AbC123");
    expect(parsed.postUrl).toBe("https://www.facebook.com/hackph/posts/42");
    expect(parsed.deadline).toBe("2026-11-20");
    expect(parsed.dates).toEqual(["2026-11-20", "2026-12-05"]);
  });

  it("reads Filipino months and cue words, and rolls a past day into next year", () => {
    expect(parsePost("Mag-apply hanggang 15 Enero!", NOW).deadline).toBe("2027-01-15");
    expect(parsePost("Deadline: 11/10/2026", NOW).deadline).toBe("2026-11-10");
  });

  it("doesn't treat Filipino 'may' as the month, or a plain date as a deadline", () => {
    expect(parsePost("may 5 slots pa para sa OJT", NOW).dates).toEqual([]);
    expect(parsePost("Seminar on Nov 9", NOW).deadline).toBeNull();
  });

  it("uses the shared link when the text has none", () => {
    const parsed = parsePost("Free AWS workshop", NOW, "https://www.linkedin.com/posts/aws_123");
    expect(parsed.postUrl).toBe("https://www.linkedin.com/posts/aws_123");
  });
});

describe("ctftimeToRows", () => {
  const event = (over: Partial<CtftimeEvent>): CtftimeEvent => ({
    id: 1,
    title: "Example CTF",
    url: "https://example-ctf.org",
    ctftime_url: "https://ctftime.org/event/1/",
    start: "2026-11-14T02:00:00+00:00",
    finish: "2026-11-15T02:00:00+00:00",
    format: "Jeopardy",
    onsite: false,
    restrictions: "Open",
    organizers: [{ id: 9, name: "Team Nine" }],
    duration: { hours: 0, days: 1 },
    ...over,
  });

  it("maps an online open CTF to a valid needs-check row", () => {
    const [row] = ctftimeToRows([event({})], NOW);
    expect(row).toMatchObject({
      id: "CTFTIME-1",
      status: "needs-check",
      organization: "Team Nine",
      deadline: "2026-11-14",
      source_url: "https://ctftime.org/event/1/",
    });
    expect(mapCsvRow(row, CATEGORIES).kind).toBe("ok");
  });

  it("skips onsite, invite-only, past, and already-listed CTFs", () => {
    const rows = ctftimeToRows(
      [
        event({ id: 2, onsite: true }),
        event({ id: 3, restrictions: "Prequalified" }),
        event({ id: 4, start: "2026-10-30T00:00:00+00:00" }),
        event({ id: 5, title: "Known CTF 2026", ctftime_url: "https://ctftime.org/event/5/" }),
        event({ id: 6, ctftime_url: "https://ctftime.org/event/6/", url: "https://listed.example" }),
      ],
      NOW,
      { titles: ["known ctf 2026"], urls: ["https://listed.example/"] },
    );
    expect(rows).toEqual([]);
  });
});

describe("calendar feeds", () => {
  const ics = [
    "BEGIN:VCALENDAR",
    "BEGIN:VEVENT",
    "UID:evt-1@lu.ma",
    "SUMMARY:Build with Copilot\\, PUP",
    "DTSTART:20261112T060000Z",
    "LOCATION:https://lu.ma/abc123",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "UID:evt-2",
    "SUMMARY:Old meetup",
    "DTSTART;VALUE=DATE:20261001",
    "URL:https://lu.ma/old",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "UID:evt-3",
    "SUMMARY:No link",
    "DTSTART:20261120T100000",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  it("turns upcoming events with an event page into needs-check rows", () => {
    const rows = icsToRows(parseIcs(ics), {
      now: NOW,
      organization: "Microsoft Student Community PUP",
      category: "Hackathons and technical competitions",
      feedHost: "api.lu.ma",
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: "Build with Copilot, PUP",
      deadline: "2026-11-12",
      source_url: "https://lu.ma/abc123",
      delivery_mode: "Online",
      status: "needs-check",
    });
    expect(mapCsvRow(rows[0], CATEGORIES).kind).toBe("ok");
  });

  it("accepts webcal links but never private addresses", () => {
    expect(feedUrl("webcal://calendar.google.com/calendar/ical/x/basic.ics")).toBe(
      "https://calendar.google.com/calendar/ical/x/basic.ics",
    );
    expect(feedUrl("https://localhost/feed.ics")).toBeNull();
    expect(feedUrl("https://192.168.1.5/feed.ics")).toBeNull();
    expect(feedUrl("not a url")).toBeNull();
  });
});
