import { describe, it, expect } from "vitest";
import { profileConfigs, getAvailableProfiles } from "./profileConfig";
import type { JsonResumeBasics } from "@/types/jsonResume";

const makeBasics = (
  profiles: JsonResumeBasics["profiles"],
): Pick<JsonResumeBasics, "profiles"> => ({ profiles });

describe("profileConfigs", () => {
  it("includes the common networks with icon + colour", () => {
    for (const key of ["LinkedIn", "GitHub", "X", "Website", "Calendly"]) {
      expect(profileConfigs[key]).toBeDefined();
      // Icons are either lucide components (forwardRef objects) or function
      // components — both are renderable, so just assert they're present.
      expect(profileConfigs[key].icon).toBeTruthy();
      expect(typeof profileConfigs[key].color).toBe("string");
    }
  });
});

describe("getAvailableProfiles", () => {
  it("returns an empty array when basics is missing", () => {
    expect(getAvailableProfiles(null)).toEqual([]);
    expect(getAvailableProfiles(undefined)).toEqual([]);
  });

  it("filters out networks without a known config and preserves order", () => {
    const basics = makeBasics([
      { network: "LinkedIn", username: "jakob", url: "https://linkedin.com/in/jakob" },
      { network: "Unknown", username: "x", url: "https://example.com" },
      { network: "GitHub", username: "jakob", url: "https://github.com/jakob" },
    ]);

    const result = getAvailableProfiles(basics).map((p) => p.network);
    expect(result).toEqual(["LinkedIn", "GitHub"]);
  });
});
