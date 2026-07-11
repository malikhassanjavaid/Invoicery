"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type DashboardTheme = "light" | "dark";

type DashboardThemeContextValue = {
  theme: DashboardTheme;
  toggleTheme: () => void;
};

const DashboardThemeContext = createContext<DashboardThemeContextValue | null>(null);

function getInitialTheme(): DashboardTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("invoicery-dashboard-theme");

  return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
}

const lightTheme = {
  "--dash-bg": "#ffffff",
  "--dash-sidebar": "#ffffff",
  "--dash-panel": "#ffffff",
  "--dash-panel-soft": "#f7f8fb",
  "--dash-hover": "#f7f7f8",
  "--dash-border": "#eef0f2",
  "--dash-border-soft": "#f1f2f4",
  "--dash-text": "#1a1a2e",
  "--dash-muted": "#9aa0a6",
  "--dash-subtle": "#6b7280",
  "--dash-primary": "#0457ff",
  "--dash-primary-hover": "#0048dc",
  "--dash-primary-text": "#ffffff",
  "--dash-danger": "#a13d3d",
  "--dash-danger-soft": "#fdf2f2",
  "--dash-shadow": "0 8px 24px rgba(16,24,40,0.12)",
  "--brand-logo-primary": "#0457ff",
  "--brand-logo-secondary": "#111827",
} as CSSProperties;

const darkTheme = {
  "--dash-bg": "#0b1020",
  "--dash-sidebar": "#10172a",
  "--dash-panel": "#121a2d",
  "--dash-panel-soft": "#182238",
  "--dash-hover": "#1b2740",
  "--dash-border": "#27324a",
  "--dash-border-soft": "#223049",
  "--dash-text": "#eef4ff",
  "--dash-muted": "#8f9bb2",
  "--dash-subtle": "#b6c0d2",
  "--dash-primary": "#4f8cff",
  "--dash-primary-hover": "#73a4ff",
  "--dash-primary-text": "#07101f",
  "--dash-danger": "#ff8e9b",
  "--dash-danger-soft": "#3a1b25",
  "--dash-shadow": "0 16px 40px rgba(0,0,0,0.28)",
  "--brand-logo-primary": "#4f8cff",
  "--brand-logo-secondary": "#ffffff",
} as CSSProperties;

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<DashboardTheme>(getInitialTheme);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((currentTheme) => {
          const nextTheme = currentTheme === "dark" ? "light" : "dark";
          window.localStorage.setItem("invoicery-dashboard-theme", nextTheme);

          return nextTheme;
        });
      },
    }),
    [theme],
  );

  return (
    <DashboardThemeContext.Provider value={value}>
      <div suppressHydrationWarning style={theme === "dark" ? darkTheme : lightTheme}>
        {children}
      </div>
    </DashboardThemeContext.Provider>
  );
}

export function DashboardThemeToggle({ sidebar = false }: { sidebar?: boolean }) {
  const context = useContext(DashboardThemeContext);

  if (!context) {
    return null;
  }

  const isDark = context.theme === "dark";

  return (
    <button
      type="button"
      onClick={context.toggleTheme}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={
        sidebar
          ? "flex w-full items-center justify-between rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-3 py-3 text-sm font-semibold text-[var(--dash-text)] shadow-sm transition hover:bg-[var(--dash-hover)]"
          : "inline-flex items-center gap-2 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-panel)] px-4 py-2.5 text-sm font-semibold text-[var(--dash-text)] shadow-sm transition hover:bg-[var(--dash-hover)]"
      }
    >
      <span className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-xl bg-[var(--dash-panel-soft)] text-[var(--dash-primary)]">
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M20.99 13.04A8 8 0 1 1 10.96 3.01a6.5 6.5 0 1 0 10.03 10.03Z" />
            </svg>
          )}
        </span>
        <span>{isDark ? "Light mode" : "Dark mode"}</span>
      </span>
      {sidebar ? (
        <span className="rounded-full bg-[var(--dash-panel-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--dash-muted)]">
          {isDark ? "On" : "Off"}
        </span>
      ) : null}
    </button>
  );
}
