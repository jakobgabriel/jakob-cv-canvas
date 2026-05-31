import { Button } from "@/components/ui/button";
import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { config } from "@/data/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Language display names and flags
const languageConfig: Record<string, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  pt: { name: 'Português', flag: '🇵🇹' },
  zh: { name: '中文', flag: '🇨🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
  ko: { name: '한국어', flag: '🇰🇷' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
};

export const ThemeLanguageToggle = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { trackThemeChange, trackLanguageChange } = useAnalytics();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    trackThemeChange(newTheme);
  };

  const handleLanguageChange = (newLanguage: string) => {
    trackLanguageChange(language, newLanguage);
    setLanguage(newLanguage);
  };

  // Only show language toggle if multi-language is enabled and there are multiple languages
  const showLanguageToggle = 
    config?.features?.multiLanguage?.enabled && 
    availableLanguages.length > 1;

  return (
    <div className="fixed top-0 right-16 md:right-6 z-50 flex gap-2 h-16 items-center">
      {/* Language Toggle - Only shown when multi-language is enabled */}
      {showLanguageToggle && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm border-border/50 shadow-minimal transition-smooth hover:shadow-professional">
              <Globe className="h-4 w-4" />
              <span className="ml-2 uppercase font-mono text-xs">{language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border-border/50">
            {availableLanguages.map((lang) => (
              <DropdownMenuItem 
                key={lang} 
                onClick={() => handleLanguageChange(lang)}
              >
                {languageConfig[lang]?.flag || '🌐'} {languageConfig[lang]?.name || lang.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className="bg-background/80 backdrop-blur-sm border-border/50 shadow-minimal transition-smooth hover:shadow-professional"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};