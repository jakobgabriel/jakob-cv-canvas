import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageDetector } from "@/components/LanguageDetector";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/lib/googleAnalytics";
import { LazyContactFormModal } from "@/components/LazyContactFormModal";
import { ContactFormProvider } from "@/contexts/ContactFormContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  // Analytics is bootstrapped in main.tsx; App only owns page views. The app
  // uses a HashRouter, so route changes never reload the page and would
  // otherwise be invisible to Google Analytics. This lives here, not in
  // useAnalytics, because App renders exactly once — the hook does not.
  useEffect(() => {
    const handleRouteChange = () => GoogleAnalytics.trackPageView();
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageDetector>
        <TooltipProvider>
          <ContactFormProvider>
            <ErrorBoundary>
              <HashRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* Redirect section anchors (e.g. #hero, #timeline, #skills) to home with scroll param */}
                  <Route path="/hero" element={<Navigate to="/?section=hero" replace />} />
                  <Route path="/timeline" element={<Navigate to="/?section=timeline" replace />} />
                  <Route path="/skills" element={<Navigate to="/?section=skills" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </HashRouter>
              <LazyContactFormModal />
            </ErrorBoundary>
            <CookieConsent />
            <Toaster />
            <Sonner />
          </ContactFormProvider>
        </TooltipProvider>
      </LanguageDetector>
    </ThemeProvider>
  );
};

export default App;
