import { useLanguage } from "@/contexts/LanguageContext";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-display font-bold text-primary/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            {language === 'de' ? 'Seite nicht gefunden' : 'Page Not Found'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'de'
              ? 'Die angeforderte Seite existiert nicht oder wurde verschoben.'
              : 'The page you are looking for does not exist or has been moved.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <a href="#/">
              <Home className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Startseite' : 'Go Home'}
            </a>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'de' ? 'Zurück' : 'Go Back'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
