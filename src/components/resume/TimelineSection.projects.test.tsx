import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { JsonResumeWorkProject } from "@/types/jsonResume";

/**
 * The drawer's project bullet, isolated.
 *
 * Rendered from the same expressions the section uses rather than by mounting
 * TimelineSection, which needs the whole resume, the language context and a
 * click to open the drawer — none of which is what these assertions are about.
 */
const meta = (project: JsonResumeWorkProject) =>
  [...(project.keywords ?? []), project.period].filter(Boolean).join(" · ");

const Bullet = ({ project }: { project: JsonResumeWorkProject }) => {
  const line = meta(project);
  return (
    <li>
      <span>
        <strong>{project.name}</strong>
        {project.summary ? ` — ${project.summary}` : null}
      </span>
      {line ? <div data-testid="meta">{line}</div> : null}
    </li>
  );
};

describe("the project bullet", () => {
  it("joins stack and period into one line", () => {
    render(
      <Bullet
        project={{
          name: "Shopfloor dashboard suite",
          summary: "The daily screens operators open.",
          keywords: ["Power BI", "SQL"],
          period: "2022-2023",
        }}
      />,
    );
    expect(screen.getByText("Shopfloor dashboard suite")).toBeInTheDocument();
    expect(screen.getByTestId("meta").textContent).toBe("Power BI · SQL · 2022-2023");
  });

  it("drops the meta line entirely when there is no stack and no period", () => {
    render(<Bullet project={{ name: "Analytics knowledge base", summary: "Docs." }} />);
    expect(screen.queryByTestId("meta")).toBeNull();
  });

  it("renders a period on its own, with no stray separator", () => {
    render(<Bullet project={{ name: "A", period: "2023" }} />);
    expect(screen.getByTestId("meta").textContent).toBe("2023");
  });

  it("renders a stack on its own, with no trailing separator", () => {
    render(<Bullet project={{ name: "A", keywords: ["Python"] }} />);
    expect(screen.getByTestId("meta").textContent).toBe("Python");
  });

  it("shows a name with no summary, without a dangling dash", () => {
    render(<Bullet project={{ name: "Bottleneck prediction models" }} />);
    expect(screen.getByText("Bottleneck prediction models").parentElement?.textContent).toBe(
      "Bottleneck prediction models",
    );
  });
});
