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
import { ContactFormModal } from "@/components/ContactFormModal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Google Analytics with tracking ID from config
    if (config?.analytics?.googleAnalyticsId) {
      GoogleAnalytics.setTrackingId(config.analytics.googleAnalyticsId);
      GoogleAnalytics.init();

      // If user has already consented, enable analytics
      const preferences = CookieManager.getPreferences();
      if (CookieManager.hasConsent() && preferences.analytics) {
        GoogleAnalytics.enable();
      }
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageDetector>
        <TooltipProvider>
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
          <ContactFormModal />
          <CookieConsent />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LanguageDetector>
    </ThemeProvider>
  );
};

export default App;
