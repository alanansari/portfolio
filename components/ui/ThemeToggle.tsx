"use client";

import { useTheme } from "@/components/ThemeProvider";
import { MoonIcon, SunIcon } from "@/components/ui/icons";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-pressed={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span className="theme-toggle__symbols" aria-hidden>
        <span className="theme-toggle__symbol">
          <SunIcon width={13} height={13} />
        </span>
        <span className="theme-toggle__symbol">
          <MoonIcon width={13} height={13} />
        </span>
      </span>
      <span className="theme-toggle__slider" aria-hidden>
        {isDark ? (
          <MoonIcon width={13} height={13} className="text-bg" />
        ) : (
          <SunIcon width={13} height={13} className="text-bg" />
        )}
      </span>
    </button>
  );
}
