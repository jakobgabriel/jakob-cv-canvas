import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const toastSpy = vi.fn();

// Isolate the component from its surrounding providers/services. `t` echoes
// its key so we can assert on stable strings; the user-facing validation
// copy under test comes from inline literals, not `t`.
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: toastSpy }) }));
vi.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({ trackFormInteraction: vi.fn() }),
}));
vi.mock("@/contexts/ContactFormContext", () => ({
  useContactForm: () => ({ isOpen: true, close: vi.fn() }),
}));
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: (key: string) => key, language: "en" }),
}));
vi.mock("@/data/config", () => ({
  config: {
    features: {
      contactForm: { enabled: true, recipientEmail: "test@example.com" },
    },
  },
}));

import { ContactFormModal } from "./ContactFormModal";

// The modal steals focus shortly after opening, which makes per-keystroke
// typing flaky; set controlled values directly with a single change event.
const setField = (root: HTMLElement, name: string, value: string) =>
  fireEvent.change(root.querySelector(`[name="${name}"]`)!, { target: { value } });

const fill = (root: HTMLElement) => {
  setField(root, "name", "Jane Doe");
  setField(root, "email", "jane@example.com");
  setField(root, "subject", "Partnership");
  setField(root, "message", "This is a sufficiently long message.");
};

const submit = (root: HTMLElement) =>
  fireEvent.click(root.querySelector('button[type="submit"]')!);

describe("ContactFormModal", () => {
  beforeEach(() => {
    toastSpy.mockReset();
    vi.restoreAllMocks();
  });

  it("shows validation errors and does not submit when empty", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { container } = render(<ContactFormModal />);

    submit(container);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { container } = render(<ContactFormModal />);

    setField(container, "name", "Jane");
    setField(container, "email", "not-an-email");
    setField(container, "subject", "Hi");
    setField(container, "message", "Long enough message.");
    submit(container);

    expect(await screen.findByText("Invalid email address")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("submits successfully and shows the success state", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ json: async () => ({ success: true }) } as Response);
    const { container } = render(<ContactFormModal />);

    fill(container);
    submit(container);

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    expect(fetchSpy.mock.calls[0][0]).toContain("formsubmit.co/ajax/test@example.com");
    // Success view uses the (mocked) translation keys.
    expect(await screen.findByText("contact.form.successTitle")).toBeInTheDocument();
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it("shows an error toast when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
    const { container } = render(<ContactFormModal />);

    fill(container);
    submit(container);

    await waitFor(() =>
      expect(toastSpy).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" }),
      ),
    );
  });
});
