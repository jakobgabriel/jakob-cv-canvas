import { describe, it, expect } from "vitest";
import { calculateDuration, calculateDurationGerman } from "./dateUtils";

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
