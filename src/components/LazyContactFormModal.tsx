import { lazy, Suspense } from "react";
import { useContactForm } from "@/contexts/ContactFormContext";

// Load the (relatively heavy) contact form only when it is first opened, so it
// stays out of the initial bundle.
const ContactFormModal = lazy(() =>
  import("@/components/ContactFormModal").then((m) => ({
    default: m.ContactFormModal,
  })),
);

export const LazyContactFormModal = () => {
  const { isOpen } = useContactForm();

  if (!isOpen) return null;

  return (
    <Suspense fallback={null}>
      <ContactFormModal />
    </Suspense>
  );
};
