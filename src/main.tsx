import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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
