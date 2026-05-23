/**
 * Banner persistente che avvisa che il sito è in fase di test.
 * NON dismissibile (è un avviso di responsabilità legale, non un'ad).
 *
 * Posizione: fixed in alto, sopra la nav, su TUTTE le pagine pubbliche.
 * Su admin non viene mostrato (l'admin sa che è un MVP).
 */
export function BetaBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-[55] bg-amber-500/15 border-b border-amber-500/40 text-amber-200 text-[11px] sm:text-xs"
    >
      <div className="container-page py-1.5 sm:py-2 flex items-center justify-center gap-2 text-center leading-tight">
        <span className="text-amber-400 shrink-0">⚠</span>
        <span>
          <strong>Sito in fase di test.</strong> Privacy policy in completamento — non
          inserire dati reali nei form. I contenuti sono <em>esempi didattici</em>, non
          consulenza finanziaria.
        </span>
      </div>
    </div>
  );
}
