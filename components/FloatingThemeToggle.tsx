"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

/** Fixed top-right theme control; sits above page content. */
export function FloatingThemeToggle() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-end p-4 pt-[max(1.5rem,env(safe-area-inset-top))] pr-[max(1.5rem,env(safe-area-inset-right))]"
      role="presentation"
    >
      <div className="pointer-events-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}
