import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl, hasCalendarDate } from "../src/lib/opportunities/calendar";

const listing = {
  id: "11111111-1111-1111-1111-111111111111",
  slug: "dost-scholarship",
  title: "DOST-SEI Scholarship, 2027; Round 1",
  organization: "DOST Science Education Institute",
  deadline: "2026-12-31",
  deadline_type: "date" as const,
  source_url: "https://sei.dost.gov.ph/",
};
const page = "https://oportune.example/opportunities/dost-scholarship";

describe("buildIcs", () => {
  const ics = buildIcs(listing, page, new Date("2026-10-25T04:05:06Z"));
  const unfolded = ics.replace(/\r\n /g, "");

  it("is an all-day event on the deadline, ending the next day", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20261231\r\n");
    expect(ics).toContain("DTEND;VALUE=DATE:20270101\r\n");
    expect(ics).toContain("DTSTAMP:20261025T040506Z\r\n");
  });

  it("escapes commas and semicolons in text", () => {
    expect(unfolded).toContain("SUMMARY:Deadline: DOST-SEI Scholarship\\, 2027\\; Round 1");
  });

  it("alerts 7 days and 1 day before", () => {
    expect(ics).toContain("TRIGGER;RELATED=START:-P7D");
    expect(ics).toContain("TRIGGER;RELATED=START:-P1D");
  });

  it("uses CRLF and folds long lines to 75 octets", () => {
    for (const line of ics.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("refuses listings without a deadline date", () => {
    expect(hasCalendarDate({ deadline: null, deadline_type: "rolling" })).toBe(false);
    expect(() => buildIcs({ ...listing, deadline: null, deadline_type: "tba" }, page)).toThrow();
  });
});

describe("googleCalendarUrl", () => {
  it("pre-fills an all-day event", () => {
    const url = new URL(googleCalendarUrl(listing, page));
    expect(url.searchParams.get("dates")).toBe("20261231/20270101");
    expect(url.searchParams.get("text")).toBe("Deadline: DOST-SEI Scholarship, 2027; Round 1");
    expect(url.searchParams.get("details")).toContain(page);
  });
});
