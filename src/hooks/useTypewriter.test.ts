import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTypewriter } from "./useTypewriter";

const setReducedMotion = (reduced: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduced && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

const PHRASES = ["ab", "cd"];

/**
 * Advances the clock in discrete steps, each in its own act().
 * One act flushes one timer: the state update it causes only re-renders — and
 * so only schedules the next timer — once act exits. A single large advance
 * would therefore type exactly one character.
 */
const tick = (ms: number, steps = 1) => {
  for (let i = 0; i < steps; i += 1) act(() => void vi.advanceTimersByTime(ms));
};

describe("useTypewriter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("types the first phrase one character at a time, after the start delay", () => {
    setReducedMotion(false);
    const { result } = renderHook(() => useTypewriter(PHRASES, { startDelayMs: 100, typeMs: 10 }));

    expect(result.current.text).toBe("");
    act(() => void vi.advanceTimersByTime(99));
    expect(result.current.text).toBe("");
    act(() => void vi.advanceTimersByTime(1));
    expect(result.current.text).toBe("a");
    act(() => void vi.advanceTimersByTime(10));
    expect(result.current.text).toBe("ab");
  });

  it("holds, deletes, and moves on to the next phrase", () => {
    setReducedMotion(false);
    const { result } = renderHook(() =>
      useTypewriter(PHRASES, { startDelayMs: 0, typeMs: 10, holdMs: 50, deleteMs: 5 }),
    );

    tick(10, 2);
    expect(result.current.text).toBe("ab");

    tick(1);
    expect(result.current.phase).toBe("holding");

    tick(50);
    expect(result.current.phase).toBe("deleting");

    tick(5, 2);
    expect(result.current.text).toBe("");

    tick(1);
    tick(10, 2);
    expect(result.current.text).toBe("cd");
  });

  it("wraps around rather than stopping on the last phrase", () => {
    setReducedMotion(false);
    const { result } = renderHook(() =>
      useTypewriter(PHRASES, { startDelayMs: 0, typeMs: 1, holdMs: 1, deleteMs: 1 }),
    );

    const seen = new Set<string>();
    for (let i = 0; i < 60; i += 1) {
      tick(1);
      if (result.current.text) seen.add(result.current.text);
    }
    // Both full phrases appear, so the rotation came round at least once.
    expect(seen.has("ab")).toBe(true);
    expect(seen.has("cd")).toBe(true);
  });

  it("types a single phrase once and then stops, rather than looping over itself", () => {
    setReducedMotion(false);
    const { result } = renderHook(() =>
      useTypewriter(["solo"], { startDelayMs: 0, typeMs: 1, holdMs: 1, deleteMs: 1 }),
    );

    tick(1, 4);
    expect(result.current.text).toBe("solo");
    tick(1, 100);
    expect(result.current.text).toBe("solo");
  });

  it("shows the first phrase whole and schedules nothing under reduced motion", () => {
    setReducedMotion(true);
    const spy = vi.spyOn(globalThis, "setTimeout");
    const { result } = renderHook(() => useTypewriter(PHRASES));

    expect(result.current.text).toBe("ab");
    expect(result.current.reduced).toBe(true);
    act(() => void vi.advanceTimersByTime(10000));
    expect(result.current.text).toBe("ab");
    expect(spy).not.toHaveBeenCalled();
  });

  it("survives an empty list", () => {
    setReducedMotion(false);
    const { result } = renderHook(() => useTypewriter([]));
    act(() => void vi.advanceTimersByTime(5000));
    expect(result.current.text).toBe("");
  });
});
