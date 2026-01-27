import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageDetector } from "@/components/LanguageDetector";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/lib/googleAnalytics";
import { CookieManager } from "@/lib/cookieManager";
import { config } from "@/data/config";
import Index from "./pages/Index";
import Contact from "./pages/Contact";

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
    <HashRouter>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <LanguageDetector>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <CookieConsent />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </LanguageDetector>
      </ThemeProvider>
    </HashRouter>
  );
};

export default App;
