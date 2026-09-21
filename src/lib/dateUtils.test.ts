import { describe, it, expect } from "vitest";
import {
  calculateDuration,
  calculateDurationGerman,
  effectiveEndDate,
  formatDateRange,
  formatMonthYear,
  hasStarted,
} from "./dateUtils";

describe("calculateDuration", () => {
  it("formats a whole year", () => {
    expect(calculateDuration("2020-01-01", "2021-01-01")).toBe("1 year");
  });

  it("formats multiple whole years", () => {
    expect(calculateDuration("2018-01-01", "2021-01-01")).toBe("3 years");
  });

  it("formats months only", () => {
    expect(calculateDuration("2020-01-01", "2020-03-01")).toBe("2 months");
  });

  it("formats a single month", () => {
    expect(calculateDuration("2020-01-01", "2020-02-01")).toBe("1 month");
  });

  it("formats years and months together", () => {
    expect(calculateDuration("2020-01-01", "2021-04-01")).toBe("1 year, 3 months");
  });

  it('does not render a brand-new role as "0 months"', () => {
    expect(calculateDuration("2026-12-01", "2026-12-05")).toBe("Less than a month");
  });
});

describe("calculateDurationGerman", () => {
  it("formats a whole year", () => {
    expect(calculateDurationGerman("2020-01-01", "2021-01-01")).toBe("1 Jahr");
  });

  it("formats months only", () => {
    expect(calculateDurationGerman("2020-01-01", "2020-03-01")).toBe("2 Monate");
  });

  it("formats years and months together", () => {
    expect(calculateDurationGerman("2020-01-01", "2021-04-01")).toBe("1 Jahr, 3 Monate");
  });

  it("does not render a brand-new role as 0 Monate", () => {
    expect(calculateDurationGerman("2026-12-01", "2026-12-05")).toBe("Weniger als 1 Monat");
  });
});

describe("formatMonthYear", () => {
  it("renders an ISO date as month and year", () => {
    expect(formatMonthYear("2024-11-08")).toBe("Nov 2024");
  });

  it("localises the month name", () => {
    expect(formatMonthYear("2024-03-01", "de")).toBe("Mär 2024");
    expect(formatMonthYear("2024-12-01", "de")).toBe("Dez 2024");
  });

  it("treats a missing end date as ongoing", () => {
    expect(formatMonthYear(undefined)).toBe("Present");
    expect(formatMonthYear(undefined, "de")).toBe("Heute");
    expect(formatMonthYear("present")).toBe("Present");
  });

  it("falls back to the raw value rather than rendering Invalid Date", () => {
    expect(formatMonthYear("not-a-date")).toBe("not-a-date");
  });

  it("falls back to English for an unknown language", () => {
    expect(formatMonthYear("2024-11-08", "fr")).toBe("Nov 2024");
  });
});

describe("formatDateRange", () => {
  it("joins both ends with an em dash", () => {
    expect(formatDateRange("2018-10-01", "2021-12-31")).toBe("Oct 2018 — Dec 2021");
  });

  it("renders an open-ended range as ongoing", () => {
    expect(formatDateRange("2026-02-01")).toBe("Feb 2026 — Present");
    expect(formatDateRange("2026-02-01", undefined, "de")).toBe("Feb 2026 — Heute");
  });

  it("still reads as ongoing while the end date is in the future", () => {
    const now = new Date("2026-09-21T12:00:00Z");
    expect(formatDateRange("2026-09-01", "2026-11-30", "en", now)).toBe("Sep 2026 — Present");
    expect(formatDateRange("2026-09-01", "2026-11-30", "de", now)).toBe("Sep 2026 — Heute");
  });

  it("closes itself once the end date has passed", () => {
    const now = new Date("2026-12-01T12:00:00Z");
    expect(formatDateRange("2026-09-01", "2026-11-30", "en", now)).toBe("Sep 2026 — Nov 2026");
  });
});

describe("effectiveEndDate", () => {
  const now = new Date("2026-09-21T12:00:00Z");

  it("drops an end date that has not arrived, so the role counts as ongoing", () => {
    expect(effectiveEndDate("2026-11-30", now)).toBeUndefined();
  });

  it("keeps an end date that has passed", () => {
    expect(effectiveEndDate("2026-08-31", now)).toBe("2026-08-31");
  });

  it("counts the end day itself as still ongoing", () => {
    expect(effectiveEndDate("2026-09-21", now)).toBeUndefined();
    expect(effectiveEndDate("2026-09-21", new Date("2026-09-22T00:30:00"))).toBe("2026-09-21");
  });

  it("treats no end date and the literal present as ongoing", () => {
    expect(effectiveEndDate(undefined, now)).toBeUndefined();
    expect(effectiveEndDate("present", now)).toBeUndefined();
  });

  it("passes an unparseable value through for the formatter to fall back on", () => {
    expect(effectiveEndDate("not-a-date", now)).toBe("not-a-date");
  });
});

describe("hasStarted", () => {
  const now = new Date("2026-09-21T12:00:00Z");

  it("is true for a date in the past", () => {
    expect(hasStarted("2026-09-01", now)).toBe(true);
  });

  it("is false for a date in the future", () => {
    expect(hasStarted("2026-12-01", now)).toBe(false);
  });

  it("treats the start day itself as started", () => {
    expect(hasStarted("2026-09-21", now)).toBe(true);
  });

  it("treats a missing or unparseable date as started, rather than hiding the role", () => {
    expect(hasStarted(undefined, now)).toBe(true);
    expect(hasStarted("not-a-date", now)).toBe(true);
  });
});
