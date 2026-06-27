import { createContext, useContext, useEffect, useMemo, useState } from "react";

import en from "../translations/en";
import hi from "../translations/hi";
import gu from "../translations/gu";

const LanguageContext = createContext();

const languages = { en, hi, gu };
const SUPPORTED = Object.keys(languages);
const STORAGE_KEY = "language";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    return saved && SUPPORTED.includes(saved) ? saved : "en";
  });

  const setLanguage = (lang) => {
    if (SUPPORTED.includes(lang)) setLanguageState(lang);
  };

  // Persist the choice and reflect it on <html lang> for a11y / SEO.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  // Merge English as the base so any untranslated key falls back gracefully
  // instead of rendering blank.
  const t = useMemo(() => ({ ...en, ...languages[language] }), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
