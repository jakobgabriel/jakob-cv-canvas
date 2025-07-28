import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { preloadCriticalResources, addResourceHints } from "@/lib/performance";
import Index from "./pages/Index";

const App: React.FC = () => {
  console.log("App component rendering");
  
  useEffect(() => {
    // Initialize performance optimizations
    preloadCriticalResources();
    addResourceHints();
  }, []);
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Index />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
