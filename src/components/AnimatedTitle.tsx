import { ElementType, Fragment } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  /** The full heading text. Split on whitespace and revealed word by word. */
  text: string;
  className?: string;
  /** Heading level. Defaults to h1 — pass h2 for section headings. */
  as?: ElementType;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between consecutive words. */
  stagger?: number;
}

/**
 * Reveals a heading one word at a time, each word sliding up from behind its
 * own clipping mask.
 *
 * Accessibility: the split is decorative, so the heading carries the whole
 * string in aria-label and the word spans are hidden from assistive tech —
 * otherwise a screen reader announces the name as disconnected fragments.
 *
 * The words are laid out normally and only *animated* into place, so the
 * heading occupies its final space from the first paint: no layout shift, and
 * if the animation never runs the title is simply there.
 */
export const AnimatedTitle = ({
  text,
  className,
  as: Tag = "h1",
  delay = 0,
  stagger = 0.1,
}: AnimatedTitleProps) => {
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={cn("title-reveal", className)} aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {/* A real space between the masks, so the heading's text content
              still reads "Jakob Gabriel" when copied or scraped. Spacing it
              with CSS alone rendered correctly but concatenated the words. */}
          {index > 0 ? " " : null}
          <span className="title-reveal-mask" aria-hidden="true">
            <span
              className="title-reveal-word"
              style={{ animationDelay: `${delay + index * stagger}s` }}
            >
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
};
