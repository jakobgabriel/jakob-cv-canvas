import type { CSSProperties } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";

interface TypedLabelProps {
  phrases: string[];
  /** The one line that must survive with no JS, no motion, and no sight. */
  fallback: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * The rotating line under the name.
 *
 * Three readers, three different strings. A screen reader gets `fallback`
 * once, as ordinary text — a caret and a half-typed word are decoration, and
 * an aria-live region spelling out "D… Di… Dig…" would be hostile. A viewer
 * who asked for reduced motion gets the first phrase, static. Everyone else
 * gets the animation.
 *
 * The phrases are stacked in one grid cell, invisible copies included, so the
 * box is always as tall as the tallest phrase at the current width. Without
 * that, a phrase that wraps to two lines on a narrow screen would shove the
 * credentials strip down mid-word, every time it came round.
 */
export const TypedLabel = ({ phrases, fallback, className, style }: TypedLabelProps) => {
  const { text, phase, reduced } = useTypewriter(phrases);
  const list = phrases.length > 0 ? phrases : [fallback];

  return (
    <h2 className={className} style={style}>
      <span className="sr-only">{fallback}</span>
      <span aria-hidden="true" className="grid justify-items-center">
        {list.map((phrase) => (
          <span key={phrase} className="col-start-1 row-start-1 invisible" aria-hidden="true">
            {phrase}
          </span>
        ))}
        <span className="col-start-1 row-start-1">
          {text}
          {!reduced && <span className="type-caret" data-phase={phase} />}
        </span>
      </span>
    </h2>
  );
};
