import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageDetector } from "@/components/LanguageDetector";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/lib/googleAnalytics";
import { CookieManager } from "@/lib/cookieManager";
import { config } from "@/data/config";
import { LazyContactFormModal } from "@/components/LazyContactFormModal";
import { ContactFormProvider } from "@/contexts/ContactFormContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  /**
   * The single place analytics is set up. useAnalytics used to do this too,
   * and it is used by eight components — each one enabled GA and fired its
   * own page view, so a returning visitor was counted nine times per load.
   * enable() sends the one page view itself via send_page_view.
   */
  useEffect(() => {
    if (!config?.analytics?.googleAnalyticsId) return;

    GoogleAnalytics.setTrackingId(config.analytics.googleAnalyticsId);
    GoogleAnalytics.init();

    const preferences = CookieManager.getPreferences();
    if (CookieManager.hasConsent() && preferences.analytics) {
      GoogleAnalytics.enable();
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageDetector>
        {/*
          delayDuration keeps an accidental hover from firing a tooltip;
          skipDelayDuration then lets every neighbouring tooltip open
          instantly while the user is still scanning the same row.
        */}
        <TooltipProvider delayDuration={400} skipDelayDuration={800}>
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
