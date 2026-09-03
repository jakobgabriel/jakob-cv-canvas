import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Cookies from "js-cookie";

// `t` echoes its key so assertions rest on stable strings rather than copy.
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key, language: "en" }),
}));

import { CookieConsent } from "./CookieConsent";
import { CookieManager } from "@/lib/cookieManager";
import { GoogleAnalytics } from "@/lib/googleAnalytics";

const clearAllCookies = () =>
  Object.keys(Cookies.get()).forEach((name) => Cookies.remove(name, { path: "/" }));

const openDetails = () => fireEvent.click(screen.getByText("cookies.learnMore"));

describe("CookieConsent", () => {
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

  it("is shown when no decision has been recorded", () => {
    render(<CookieConsent />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("stays hidden once a decision exists", () => {
    CookieManager.saveConsent(false);
    render(<CookieConsent />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("labels and focuses itself so it is reachable without a mouse", () => {
    render(<CookieConsent />);

    const banner = screen.getByRole("dialog");
    expect(banner).toHaveAccessibleName("cookies.title");
    expect(banner).toHaveFocus();
  });

  it("enables analytics on Accept All", () => {
    const enable = vi.spyOn(GoogleAnalytics, "enable");
    render(<CookieConsent />);

    fireEvent.click(screen.getByText("cookies.acceptAll"));

    expect(CookieManager.analyticsAllowed()).toBe(true);
    expect(enable).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("grants analytics on Accept All even if the details switch is off", () => {
    render(<CookieConsent />);
    openDetails();

    // The switch defaults to off; "Accept All" must mean all regardless.
    fireEvent.click(screen.getByText("cookies.acceptAll"));

    expect(CookieManager.analyticsAllowed()).toBe(true);
  });

  it("records a decline as a decision so the banner does not return", () => {
    const disable = vi.spyOn(GoogleAnalytics, "disable");
    render(<CookieConsent />);

    fireEvent.click(screen.getByText("cookies.decline"));

    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.analyticsAllowed()).toBe(false);
    expect(disable).toHaveBeenCalled();
  });

  it("treats the close button as a decline", () => {
    render(<CookieConsent />);

    fireEvent.click(screen.getByLabelText("cookies.decline"));

    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it("does not pre-tick the analytics switch", () => {
    render(<CookieConsent />);
    openDetails();

    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("saves only what the visitor picked when using Save Choices", () => {
    render(<CookieConsent />);
    openDetails();
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByText("cookies.savePreferences"));

    expect(CookieManager.analyticsAllowed()).toBe(true);
  });

  it("declines through Save Choices when the switch is left off", () => {
    render(<CookieConsent />);
    openDetails();
    fireEvent.click(screen.getByText("cookies.savePreferences"));

    expect(CookieManager.hasConsentDecision()).toBe(true);
    expect(CookieManager.analyticsAllowed()).toBe(false);
  });

  it("disables the analytics switch when the browser already opted out", () => {
    vi.spyOn(GoogleAnalytics, "isSuppressedByPrivacySignal").mockReturnValue(true);
    render(<CookieConsent />);
    openDetails();

    expect(screen.getByRole("switch")).toBeDisabled();
    expect(screen.getByText("cookies.privacySignal")).toBeInTheDocument();
  });
});
