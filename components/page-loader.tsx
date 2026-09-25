"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { OPEN_KEY } from "@/components/hero";

const PAGES: Record<string, { label: string; color: string }> = {
  "/": { label: "The croissant", color: "var(--color-accent)" },
  "/about": { label: "About me", color: "#A5323F" },
  "/experience": { label: "Experience", color: "#D9782B" },
  "/activity": { label: "Activity", color: "#3C8C68" },
  "/certificate": { label: "Certificate", color: "#E0B03A" },
  "/interest": { label: "Interest", color: "#2F63B0" },
};

declare global { interface Window { __croissantReady?: boolean } }

const Crescent = () => (
  <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M4 20c2-9 10-14 18-13 3 .4 5.6 1.8 6 3.6-3-1.4-7-1.2-10.4.6-3.6 1.9-6.1 5.3-6.6 9.3-2.2 1.2-4.9 1.2-7 -.5z" fill="#d9a24f" stroke="color-mix(in srgb,#5a3b0a 55%,transparent)" strokeWidth="1" />
    <path d="M11 12.5l2.2 3.2M15.4 10.2l1.4 3.6M20 9.4l.4 3.7" stroke="color-mix(in srgb,#5a3b0a 60%,transparent)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
  </svg>
);

// Full-screen loader: covers the first load only, until the document, fonts,
// above-the-fold images (and on Hero, the croissant) are ready. Tab switches navigate instantly.
export default function PageLoader() {
  const pathname = usePathname();
  const [shown, setShown] = useState(true);
  const [target] = useState(pathname);

  // Links back to the opened croissant tell Hero to jump to the layers view.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !(u.pathname in PAGES) || u.pathname === location.pathname) return;
      if (u.hash === "#layers") try { sessionStorage.setItem(OPEN_KEY, "1"); } catch {}
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Hide once the first page is ready.
  useEffect(() => {
    if (!shown) return;
    const isHero = pathname === "/";
    let croissant = !isHero || !!window.__croissantReady;
    const onReady = () => { croissant = true; };
    document.addEventListener("croissant-ready", onReady, true);
    const t0 = performance.now();
    let timer: ReturnType<typeof setTimeout>;
    const aboveFoldReady = () => [...document.images].every((img) => {
      const r = img.getBoundingClientRect();
      return r.top >= innerHeight || r.bottom <= 0 || img.complete;
    });
    const check = () => {
      const el = performance.now() - t0;
      const ready = document.readyState === "complete" && (!document.fonts || document.fonts.status === "loaded") && aboveFoldReady() && croissant && el > 450;
      if (ready || el > (isHero ? 12000 : 8000)) { setShown(false); return; }
      timer = setTimeout(check, 120);
    };
    check();
    return () => { clearTimeout(timer); document.removeEventListener("croissant-ready", onReady, true); };
  }, [pathname, shown]);

  const page = PAGES[target] ?? { label: "Loading", color: "var(--color-accent)" };
  return (
    <div id="site-loader" role="status" aria-live="polite" data-hidden={shown ? undefined : ""}>
      <div style={{ position: "relative", width: 132, height: 132 }}>
        <svg width="132" height="132" viewBox="0 0 132 132" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          <circle cx="66" cy="66" r="52" fill="none" stroke="var(--color-divider)" strokeWidth="1" />
          <circle cx="66" cy="66" r="52" fill="none" stroke={page.color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="60 267" style={{ transformOrigin: "66px 66px", animation: "site-orbit 1.6s linear infinite" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, animation: "site-orbit 2.4s cubic-bezier(.45,.05,.55,.95) infinite" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, transform: "translate(-50%,-2px)" }}><Crescent /></div>
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontSize: 30, fontStyle: "italic", color: "var(--color-accent-700)" }}>RP</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", padding: "0 24px" }}>
        <div style={{ fontFamily: "var(--font-heading)", fontSize: 28, lineHeight: 1.1 }}>{page.label}</div>
        <div style={{ fontStyle: "italic", fontSize: 14, color: "var(--color-neutral-700)", animation: "site-breathe 1.8s ease-in-out infinite" }}>
          {target === "/" ? "Baking the croissant" : "Unfolding the layer"}
        </div>
      </div>
    </div>
  );
}
