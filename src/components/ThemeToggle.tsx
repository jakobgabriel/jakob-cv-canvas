import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAnalytics } from "@/hooks/useAnalytics";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { trackThemeChange } = useAnalytics();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    trackThemeChange(newTheme);
  };

  return (
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
  );
};
