import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations } from "../data/translations";

export type Language = "pt" | "en" | "pl" | "es" | "fr" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getBrowserLanguage(): Language {
  const lang = navigator.language.slice(0, 2).toLowerCase();
  switch (lang) {
    case 'pl': return 'pl';
    case 'pt': return 'pt';
    case 'es': return 'es';
    case 'fr': return 'fr';
    case 'de': return 'de';
    default: return 'en'; // default for all other languages
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getBrowserLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage") as Language | null;
    if (savedLang && ["pt", "en", "pl", "es", "fr", "de"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  const t = (key: string): any => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Fallback
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
