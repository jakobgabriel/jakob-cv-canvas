import { describe, it, expect } from "vitest";
import {
  calculateDuration,
  calculateDurationGerman,
  formatDateRange,
  formatMonthYear,
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
});
