import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LanguageProvider availableLanguages={["en", "de"]} defaultLanguage="en">
    {children}
  </LanguageProvider>
);

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("translates known keys for the active language", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t("nav.experience")).toBe("Experience");

    act(() => result.current.setLanguage("de"));
    expect(result.current.t("nav.experience")).toBe("Erfahrung");
  });

  it("falls back to the key itself for an unknown translation key", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    expect(result.current.t("totally.unknown.key")).toBe("totally.unknown.key");
  });

  it("persists a valid language choice to localStorage", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLanguage("de"));
    expect(result.current.language).toBe("de");
    expect(localStorage.getItem("language")).toBe("de");
  });

  it("ignores a language that is not available", () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    act(() => result.current.setLanguage("fr"));
    expect(result.current.language).toBe("en");
    expect(localStorage.getItem("language")).toBeNull();
  });

  it("throws when used outside a provider", () => {
    expect(() => renderHook(() => useLanguage())).toThrow(
      /must be used within a LanguageProvider/,
    );
  });
});
