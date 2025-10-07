import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageDetector } from "@/components/LanguageDetector";
import Index from "./pages/Index";

const App: React.FC = () => {
  console.log("App component rendering");
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageDetector>
        <TooltipProvider>
          <Index />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LanguageDetector>
    </ThemeProvider>
  );
};

export default App;
