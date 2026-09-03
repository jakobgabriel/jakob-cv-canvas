import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable faces, bundled and served from our own origin. The
// weight axis alone covers every weight the design uses, in one file per family.
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "./index.css";
import App from "./App";
import { bootstrapAnalytics } from "@/lib/analyticsBootstrap";

// Set up Consent Mode before the first component mounts, so no early event is
// dropped and no consent-denied hit slips out.
bootstrapAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
