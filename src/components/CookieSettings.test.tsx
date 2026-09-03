import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Cookies from "js-cookie";

vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key, language: "en" }),
}));

import { CookieSettings } from "./CookieSettings";
import { CookieManager } from "@/lib/cookieManager";
import { GoogleAnalytics } from "@/lib/googleAnalytics";

const clearAllCookies = () =>
  Object.keys(Cookies.get()).forEach((name) => Cookies.remove(name, { path: "/" }));

const openDialog = () => fireEvent.click(screen.getByLabelText("cookies.settings"));

describe("CookieSettings", () => {
  beforeEach(() => {
    clearAllCookies();
    GoogleAnalytics.reset();
    GoogleAnalytics.setTrackingId("G-TEST12345");
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clearAllCookies();
    GoogleAnalytics.reset();
  });

  it("hides the gear until a decision has been made", () => {
    render(<CookieSettings />);

    expect(screen.queryByLabelText("cookies.settings")).not.toBeInTheDocument();
  });

  it("appears as soon as consent is recorded, without a reload", () => {
    render(<CookieSettings />);

    act(() => {
      CookieManager.saveConsent(true);
    });

    expect(screen.getByLabelText("cookies.settings")).toBeInTheDocument();
  });

  it("reflects the stored choice when opened", () => {
    CookieManager.saveConsent(true);
    render(<CookieSettings />);

    openDialog();

    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("picks up a choice made after the component mounted", () => {
    CookieManager.saveConsent(false);
    render(<CookieSettings />);

    // Simulates the visitor accepting in the banner after this mounted.
    act(() => {
      CookieManager.saveConsent(true);
    });
    openDialog();

    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("keeps the consent decision when analytics is switched off", () => {
    CookieManager.saveConsent(true);
    const disable = vi.spyOn(GoogleAnalytics, "disable");
    render(<CookieSettings />);

    openDialog();
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByText("cookies.savePreferences"));

    expect(CookieManager.analyticsAllowed()).toBe(false);
    // Withdrawing must not reset the visitor to "never asked".
    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(disable).toHaveBeenCalled();
    expect(screen.getByLabelText("cookies.settings")).toBeInTheDocument();
  });

  it("re-enables analytics when switched back on", () => {
    CookieManager.saveConsent(false);
    const enable = vi.spyOn(GoogleAnalytics, "enable");
    render(<CookieSettings />);

    openDialog();
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByText("cookies.savePreferences"));

    expect(CookieManager.analyticsAllowed()).toBe(true);
    expect(enable).toHaveBeenCalled();
  });
});
