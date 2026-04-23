"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "lite";

interface ThemeCtx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("mc-theme") as Theme | null;
    if (saved === "lite" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "lite") {
      html.classList.add("lite");
    } else {
      html.classList.remove("lite");
    }
    localStorage.setItem("mc-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "lite" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
