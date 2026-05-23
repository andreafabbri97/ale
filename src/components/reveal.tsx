"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * Delay tra il trigger (entrata in view) e l'inizio dell'animazione.
   * Espresso come "step" — moltiplica per il delay base (~80ms).
   * Da 0 a 8.
   */
  stagger?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  /**
   * Soglia di visibilità (0-1) per triggerare l'animazione.
   * Default 0.12 = quando il 12% dell'elemento entra in viewport.
   */
  threshold?: number;
  /**
   * Margine attorno al viewport per anticipare il trigger.
   * Default "-50px" = aspetta che l'elemento sia 50px dentro.
   */
  rootMargin?: string;
  /**
   * Se true (default) l'animazione parte una sola volta.
   * Se false, ri-parte ogni volta che l'elemento esce e rientra.
   */
  once?: boolean;
}

/**
 * Wrapper che applica un fade-up animation quando l'elemento entra in viewport.
 * Usa IntersectionObserver — zero dipendenze esterne.
 *
 * Esempio:
 * ```tsx
 * <Reveal stagger={1}>
 *   <h2>Titolo</h2>
 * </Reveal>
 * ```
 */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  stagger = 0,
  threshold = 0.12,
  rootMargin = "0px 0px -50px 0px",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: se IntersectionObserver non è supportato, mostra subito
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(el);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const combinedClassName = `reveal ${visible ? "is-visible" : ""} ${className}`.trim();

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={combinedClassName}
      data-stagger={stagger > 0 ? String(stagger) : undefined}
    >
      {children}
    </Tag>
  );
}
