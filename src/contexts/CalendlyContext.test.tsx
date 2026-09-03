import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const openCalendlyPopup = vi.fn();

vi.mock("@/lib/calendly", () => ({
  CALENDLY_URL: "https://calendly.com/jakob-gabriel/30min",
  openCalendlyPopup: (...args: unknown[]) => openCalendlyPopup(...args),
}));

// `t` echoes its key so assertions rest on stable strings rather than copy.
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key, language: "en" }),
}));

import { CalendlyProvider } from "./CalendlyContext";
import { CalendlyConsentDialog } from "@/components/CalendlyConsentDialog";
import { useCalendly } from "@/hooks/useCalendly";

const BookButton = () => {
  const { requestCalendly } = useCalendly();
  return <button onClick={requestCalendly}>book</button>;
};

const renderBooking = () =>
  render(
    <CalendlyProvider>
      <BookButton />
      <CalendlyConsentDialog />
    </CalendlyProvider>
  );

/** Any Calendly asset the page has actually asked the browser to fetch. */
const calendlyAssets = () =>
  document.querySelectorAll('script[src*="calendly"], link[href*="calendly"]');

describe("Calendly two-click flow", () => {
  beforeEach(() => {
    openCalendlyPopup.mockClear();
    calendlyAssets().forEach((el) => el.remove());
  });

  it("requests nothing from Calendly on render", () => {
    renderBooking();

    // The whole point: an unrelated visitor never touches a US service.
    expect(calendlyAssets()).toHaveLength(0);
    expect(openCalendlyPopup).not.toHaveBeenCalled();
  });

  it("still requests nothing when the prompt is opened", () => {
    renderBooking();

    fireEvent.click(screen.getByText("book"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(calendlyAssets()).toHaveLength(0);
    expect(openCalendlyPopup).not.toHaveBeenCalled();
  });

  it("names the recipient and what is transmitted, so the click is informed", () => {
    renderBooking();
    fireEvent.click(screen.getByText("book"));

    expect(screen.getByText("calendly.description")).toBeInTheDocument();
  });

  it("loads Calendly only once the visitor confirms", () => {
    renderBooking();
    fireEvent.click(screen.getByText("book"));
    fireEvent.click(screen.getByText("calendly.confirm"));

    expect(openCalendlyPopup).toHaveBeenCalledTimes(1);
  });

  it("loads nothing when the visitor declines", () => {
    renderBooking();
    fireEvent.click(screen.getByText("book"));
    fireEvent.click(screen.getByText("common.cancel"));

    expect(openCalendlyPopup).not.toHaveBeenCalled();
    expect(calendlyAssets()).toHaveLength(0);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not remember the answer — each booking asks again", () => {
    renderBooking();

    fireEvent.click(screen.getByText("book"));
    fireEvent.click(screen.getByText("calendly.confirm"));
    fireEvent.click(screen.getByText("book"));

    // Persisting the choice would mean writing to the visitor's device, which
    // is the thing this design exists to avoid.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
