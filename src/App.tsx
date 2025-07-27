import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";

const App: React.FC = () => {
  console.log("App component rendering");
  
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
