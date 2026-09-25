"use client";

import { useEffect, useState } from "react";

import { THEME_KEY } from "@/lib/theme";

type Theme = "dark" | "light";

const svg = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const ICONS: Record<Theme, React.ReactNode> = {
  light: <svg {...svg}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  dark: <svg {...svg}><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" /></svg>,
};

// Toggles Dark <-> Light, starting from the device theme; the choice is persisted in localStorage (the inline script in layout applies it before paint).
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = document.documentElement.getAttribute("data-theme") as Theme | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the attribute set pre-hydration
    setTheme(saved || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      id="site-theme"
      type="button"
      onClick={toggle}
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {ICONS[theme]}
    </button>
  );
}
