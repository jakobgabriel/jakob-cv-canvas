import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe, Printer } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeLanguageToggle = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { trackThemeChange, trackLanguageChange } = useAnalytics();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    trackThemeChange(newTheme);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'de') => {
    trackLanguageChange(language, newLanguage);
    setLanguage(newLanguage);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed top-0 right-6 z-50 flex gap-2 h-16 items-center">
      {/* Print Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="bg-background/80 backdrop-blur-sm border-border/50 shadow-minimal transition-smooth hover:shadow-professional"
      >
        <Printer className="h-4 w-4" />
        <span className="sr-only">Print resume</span>
      </Button>

      {/* Language Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm border-border/50 shadow-minimal transition-smooth hover:shadow-professional">
            <Globe className="h-4 w-4" />
            <span className="ml-2 uppercase font-mono text-xs">{language}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border-border/50">
          <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
            🇺🇸 English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLanguageChange('de')}>
            🇩🇪 Deutsch
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="bg-background/80 backdrop-blur-sm border-border/50 shadow-minimal transition-smooth hover:shadow-professional"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};