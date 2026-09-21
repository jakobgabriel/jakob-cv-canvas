import { useEffect, useRef, useState } from "react";

export type TypewriterPhase = "typing" | "holding" | "deleting";

export interface TypewriterOptions {
  /** Milliseconds per character while typing. */
  typeMs?: number;
  /** Milliseconds per character while deleting — faster, as exits should be. */
  deleteMs?: number;
  /** How long a completed phrase stays on screen. */
  holdMs?: number;
  /** Delay before the first character, to let the name land first. */
  startDelayMs?: number;
}

const DEFAULTS: Required<TypewriterOptions> = {
  typeMs: 55,
  deleteMs: 28,
  holdMs: 1900,
  startDelayMs: 900,
};

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Types a list of phrases one after another, deleting each before the next.
 *
 * Two things this deliberately does not do. It never reports a phase of
 * "typing" for a viewer who asked for reduced motion — it returns the first
 * phrase whole and schedules nothing, so no timer runs for the life of the
 * page. And it never animates a single-item list into an empty string and
 * back; with one phrase it types once and stops, because there is nothing to
 * rotate to and a caret blinking over a static line is just noise.
 *
 * The caller is responsible for the accessible copy: everything here is
 * decorative and belongs behind aria-hidden.
 */
export const useTypewriter = (phrases: string[], options: TypewriterOptions = {}) => {
  const { typeMs, deleteMs, holdMs, startDelayMs } = { ...DEFAULTS, ...options };

  const reduced = prefersReducedMotion();
  const first = phrases[0] ?? "";

  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reduced ? first : "");
  const [phase, setPhase] = useState<TypewriterPhase>(reduced ? "holding" : "typing");
  const started = useRef(false);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;

    const current = phrases[index % phrases.length];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (text === current) {
        // A single phrase has nowhere to go next, so it simply stays.
        if (phrases.length === 1) return;
        timer = setTimeout(() => setPhase("holding"), 0);
      } else {
        const delay = started.current ? typeMs : startDelayMs;
        started.current = true;
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), delay);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      if (text === "") {
        timer = setTimeout(() => {
          setIndex((i) => (i + 1) % phrases.length);
          setPhase("typing");
        }, 0);
      } else {
        timer = setTimeout(() => setText(text.slice(0, -1)), deleteMs);
      }
    }

    return () => clearTimeout(timer);
  }, [text, phase, index, phrases, reduced, typeMs, deleteMs, holdMs, startDelayMs]);

  return { text, phase, reduced };
};
