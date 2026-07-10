"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type LandingTheme = "light" | "dark";

type LandingThemeContextValue = {
  theme: LandingTheme;
  toggleTheme: () => void;
};

const LandingThemeContext = createContext<LandingThemeContextValue | null>(null);

function getInitialTheme(): LandingTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("invoicery-theme");

  return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
}

const lightTheme = {
  "--page-bg": "#f7f7f8",
  "--surface": "#ffffff",
  "--surface-soft": "#f7f7f8",
  "--surface-muted": "#ececef",
  "--text": "#262326",
  "--text-muted": "#6f6f76",
  "--text-soft": "#5f5b60",
  "--border": "#e6e6e9",
  "--accent": "#f9d9df",
  "--accent-strong": "#ad6672",
  "--accent-border": "#ead2d7",
  "--accent-hover": "#f6cbd3",
  "--dark-surface": "#262326",
  "--dark-surface-hover": "#3a363a",
  "--dark-text": "#ffffff",
  "--dark-muted": "#d7d7dc",
  "--dark-soft": "#f1eef0",
  "--hero-from": "#f9d9df",
  "--hero-via": "#f7f7f8",
  "--hero-to": "#ffffff",
  "--glow-one": "#f9d9df",
  "--glow-two": "#e9e9ec",
  "--shadow-button": "0 8px 24px rgba(38,35,38,0.18)",
  "--shadow-hero": "0 30px 80px rgba(38,35,38,0.12)",
  "--shadow-card": "0 16px 40px rgba(38,35,38,0.08)",
} as CSSProperties;

const darkTheme = {
  "--page-bg": "#151315",
  "--surface": "#211e21",
  "--surface-soft": "#2a262a",
  "--surface-muted": "#342f34",
  "--text": "#fff8fa",
  "--text-muted": "#c9c2c6",
  "--text-soft": "#ded6da",
  "--border": "#3d373d",
  "--accent": "#f9d9df",
  "--accent-strong": "#f4b9c4",
  "--accent-border": "#5b4249",
  "--accent-hover": "#ffe7ec",
  "--dark-surface": "#f9d9df",
  "--dark-surface-hover": "#ffe7ec",
  "--dark-text": "#262326",
  "--dark-muted": "#cfc5ca",
  "--dark-soft": "#f5e9ed",
  "--hero-from": "#30242a",
  "--hero-via": "#1d1a1d",
  "--hero-to": "#151315",
  "--glow-one": "#6d4a53",
  "--glow-two": "#2f2b30",
  "--shadow-button": "0 8px 24px rgba(0,0,0,0.3)",
  "--shadow-hero": "0 30px 80px rgba(0,0,0,0.34)",
  "--shadow-card": "0 16px 40px rgba(0,0,0,0.22)",
} as CSSProperties;

export function LandingThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<LandingTheme>(getInitialTheme);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((currentTheme) => {
          const nextTheme = currentTheme === "dark" ? "light" : "dark";
          window.localStorage.setItem("invoicery-theme", nextTheme);

          return nextTheme;
        });
      },
    }),
    [theme],
  );

  return (
    <LandingThemeContext.Provider value={value}>
      <div suppressHydrationWarning style={theme === "dark" ? darkTheme : lightTheme}>{children}</div>
    </LandingThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const context = useContext(LandingThemeContext);

  if (!context) {
    return null;
  }

  const isDark = context.theme === "dark";

  return (
    <button
      type="button"
      onClick={context.toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent-border)] hover:bg-[var(--surface-soft)]"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="M20.99 13.04A8 8 0 1 1 10.96 3.01a6.5 6.5 0 1 0 10.03 10.03Z" />
        </svg>
      )}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
