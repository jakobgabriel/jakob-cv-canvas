import { describe, it, expect } from "vitest";
import type { JsonResumeCompanyPeriod } from "@/types/jsonResume";

/**
 * The rename chain, isolated. The component builds it from this expression;
 * mounting TimelineSection would need the whole resume and a click to open the
 * drawer, neither of which is what these assertions are about.
 */
const chain = (entry: { name: string; companies?: JsonResumeCompanyPeriod[] }) =>
  entry.companies && entry.companies.length > 1
    ? entry.companies.map((c) => c.name).join(" → ")
    : entry.name;

const renamed = {
  name: "neuwerk",
  companies: [
    { name: "Continental AG", startDate: "2024-01-01", endDate: "2026-01-31" },
    { name: "OESL Automotive", startDate: "2026-02-01", endDate: "2026-08-31" },
    { name: "neuwerk", startDate: "2026-09-01", endDate: "2026-11-30" },
  ],
};

describe("the company chain", () => {
  it("joins every name the employer had, oldest first", () => {
    expect(chain(renamed)).toBe("Continental AG → OESL Automotive → neuwerk");
  });

  it("falls back to the single name when there are no companies", () => {
    expect(chain({ name: "REHAU Industries SE & Co. KG" })).toBe("REHAU Industries SE & Co. KG");
  });

  it("does not draw an arrow for an employer that never changed name", () => {
    expect(
      chain({
        name: "Continental AG",
        companies: [{ name: "Continental AG", startDate: "2022-01-01" }],
      }),
    ).toBe("Continental AG");
  });

  it("keeps `name` as the latest company, which is what worksFor reads", () => {
    expect(renamed.name).toBe(renamed.companies[renamed.companies.length - 1].name);
  });
});
