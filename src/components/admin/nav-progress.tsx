"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Barra di progresso in alto che dà feedback visivo immediato durante
 * le navigazioni admin. Si attiva intercettando i click sui link interni
 * e si nasconde quando il pathname effettivamente cambia (= navigation done).
 *
 * Senza dipendenze esterne (no NProgress, no nprogress react).
 */
export function NavProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }

  // Quando il pathname/searchParams cambiano = navigation completata
  // → "spegni" la barra
  useEffect(() => {
    if (!visible) return;
    setProgress(100);
    const t1 = setTimeout(() => setVisible(false), 200);
    const t2 = setTimeout(() => setProgress(0), 400);
    timersRef.current.push(t1, t2);
    return clearTimers;
    // visible NON in deps di proposito (vogliamo solo trigger su pathname change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  // Intercept click sui link interni per partire IMMEDIATAMENTE
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Solo click sinistro, no modifier
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip: external, mailto, tel, anchor interno (#), download
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        anchor.hasAttribute("download") ||
        anchor.target === "_blank"
      ) {
        return;
      }

      // È una internal navigation → start progress
      clearTimers();
      setVisible(true);
      setProgress(15);

      // Salita progressiva fake fino a 80% (non lo facciamo arrivare al 100%
      // finché il pathname non cambia davvero)
      const steps = [
        { d: 200, v: 35 },
        { d: 450, v: 55 },
        { d: 800, v: 75 },
        { d: 1200, v: 85 },
      ];
      steps.forEach((s) => {
        const t = setTimeout(() => setProgress((cur) => (cur < s.v ? s.v : cur)), s.d);
        timersRef.current.push(t);
      });
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimers();
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)]"
        style={{
          width: `${progress}%`,
          transition: "width 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "0 0 12px rgba(59, 212, 248, 0.7)",
        }}
      />
    </div>
  );
}
