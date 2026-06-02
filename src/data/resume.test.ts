import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock the bundled resume.json as a multi-language map (with one bogus,
// non-resume key) so we can exercise the language-resolution logic.
vi.mock("../../public/data/resume.json", () => ({
  default: {
    en: { basics: { name: "EN Person" }, work: [], education: [], skills: [] },
    de: { basics: { name: "DE Person" }, work: [], education: [], skills: [] },
    _meta: { note: "not a resume" },
  },
}));

// Mock config with a mutable multiLanguage flag we can flip per test.
vi.mock("./config", () => ({
  config: {
    features: {
      downloadResume: { enabled: false, url: "" },
      contactForm: { enabled: false, recipientEmail: "" },
      multiLanguage: { enabled: true, defaultLanguage: "en" },
    },
    analytics: { googleAnalyticsId: "" },
    theme: { primaryColor: "", darkMode: false },
  },
}));

import { getResumeData, getAvailableLanguages } from "./resume";
import { config } from "./config";

describe("getResumeData (multi-language)", () => {
  beforeEach(() => {
    config.features.multiLanguage.enabled = true;
    config.features.multiLanguage.defaultLanguage = "en";
  });

  it("returns the requested language", () => {
    expect(getResumeData("de").basics.name).toBe("DE Person");
    expect(getResumeData("en").basics.name).toBe("EN Person");
  });

  it("falls back to the default language for an unknown language", () => {
    // Must NOT return the whole multi-language map.
    const data = getResumeData("fr");
    expect(data.basics.name).toBe("EN Person");
    expect(data).not.toHaveProperty("de");
  });
});

describe("getAvailableLanguages", () => {
  beforeEach(() => {
    config.features.multiLanguage.enabled = true;
    config.features.multiLanguage.defaultLanguage = "en";
  });

  it("lists only keys whose value is actually a resume", () => {
    expect(getAvailableLanguages()).toEqual(["en", "de"]);
  });

  it("returns just the default language when multi-language is disabled", () => {
    config.features.multiLanguage.enabled = false;
    config.features.multiLanguage.defaultLanguage = "en";
    expect(getAvailableLanguages()).toEqual(["en"]);
  });
});
