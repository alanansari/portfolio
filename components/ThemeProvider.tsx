"use client";

import { THEME_STORAGE_KEY } from "@/components/ThemeScript";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

// The `data-theme` attribute on <html> (set pre-paint by ThemeScript) is the source of truth.
function readTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function hasSavedTheme(): boolean {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "dark" || saved === "light";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Follow OS changes live until the user picks a theme via the toggle.
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = (e: MediaQueryListEvent) => {
    if (hasSavedTheme()) return;
    document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
  };
  mq.addEventListener("change", onSystemChange);

  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onSystemChange);
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "light");

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
