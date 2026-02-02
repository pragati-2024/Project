/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const STORAGE_KEY = "theme"; // 'light' | 'dark' | 'system'

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme) {
  if (theme === "system") return getSystemTheme();
  return theme === "dark" ? "dark" : "light";
}

function applyThemeToDocument(theme) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.theme = resolved;
  // Helps native controls match theme
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // Default to system if nothing is saved
      const initial = saved === "light" || saved === "dark" || saved === "system" ? saved : "system";
      // Apply immediately to avoid a light/dark flash on first paint
      applyThemeToDocument(initial);
      return initial;
    } catch {
      return "system";
    }
  });

  useEffect(() => {
    applyThemeToDocument(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyThemeToDocument("system");

    if (media.addEventListener) media.addEventListener("change", handler);
    else media.addListener(handler);

    return () => {
      if (media.removeEventListener) media.removeEventListener("change", handler);
      else media.removeListener(handler);
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme: resolveTheme(theme),
      setTheme,
      toggleTheme: () => setTheme((t) => (resolveTheme(t) === "dark" ? "light" : "dark")),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
