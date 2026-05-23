"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Valore numerico finale (es. 87, 95, 3). */
  to: number;
  /** Durata animazione in ms. */
  duration?: number;
  /** Suffisso (es. "%"). */
  suffix?: string;
  /** Prefisso (es. "+", "-", "€"). */
  prefix?: string;
  /** Numero di decimali (default 0). */
  decimals?: number;
  /** Separatore migliaia (default ".") */
  thousandsSep?: string;
  /** className extra. */
  className?: string;
}

function formatNumber(n: number, decimals: number, thousandsSep: string): string {
  const fixed = n.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  return decPart ? `${grouped},${decPart}` : grouped;
}

/**
 * Numero che si anima da 0 al valore target quando entra nel viewport.
 * Easing: ease-out cubic per atterraggio morbido sul valore finale.
 */
export function CountUp({
  to,
  duration = 1400,
  suffix = "",
  prefix = "",
  decimals = 0,
  thousandsSep = ".",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Se IntersectionObserver non c'è, animare comunque al mount
    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            animate();
            observer.disconnect();
            return;
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    function animate() {
      const start = performance.now();
      const startValue = 0;

      function frame(now: number) {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        const current = startValue + (to - startValue) * eased;
        setValue(current);
        if (t < 1) requestAnimationFrame(frame);
        else setValue(to);
      }

      requestAnimationFrame(frame);
    }

    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(value, decimals, thousandsSep)}
      {suffix}
    </span>
  );
}
