"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground text-base"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="button"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
