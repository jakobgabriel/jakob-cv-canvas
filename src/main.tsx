import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

/*
  Self-hosted fonts. Previously pulled from fonts.googleapis.com, which sent
  every visitor's IP to Google before they had answered the cookie banner.

  Only the weights the app actually uses, latin subset only — German copy
  (ä/ö/ü/ß, TÜV) lives in latin-1, so latin-ext is not needed. JetBrains Mono
  is gone entirely: nothing references font-mono any more.
*/
// Inter carries body copy: 400 default, 500 for font-medium, 600 for the
// dialog/toast titles and the 404 page. Nothing sets font-bold on body text.
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
// DM Sans carries every heading — index.css applies font-display to h1-h6 —
// so font-semibold on a heading asks for DM Sans 600, not Inter 600. Dropping
// 600 left the 404 heading with no exact face to match.
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
