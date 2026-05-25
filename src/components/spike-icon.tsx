interface SpikeIconProps {
  className?: string;
  size?: number | string;
  title?: string;
}

/**
 * Spike — granchio 8-bit con occhi a dollaro.
 * Pixel-art su viewBox 512: corpo/chele/zampe in cyan accent, occhi bianchi
 * grandi (120×96) con $ in pixel-art a cella 12 unità (S 5×7 + asta verticale).
 */
export function SpikeIcon({ className, size = 32, title }: SpikeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
    >
      {title && <title>{title}</title>}

      {/* === CORPO + CHELE + ZAMPE === */}
      <g fill="var(--spike-body, #3BD4F8)">
        {/* Chele sx */}
        <rect x="32" y="64" width="64" height="32" />
        <rect x="32" y="96" width="32" height="32" />
        <rect x="96" y="96" width="32" height="32" />
        <rect x="64" y="128" width="64" height="32" />
        {/* Chele dx */}
        <rect x="416" y="64" width="64" height="32" />
        <rect x="448" y="96" width="32" height="32" />
        <rect x="384" y="96" width="32" height="32" />
        <rect x="384" y="128" width="64" height="32" />

        {/* Carapace */}
        <rect x="128" y="160" width="256" height="32" />
        <rect x="64" y="192" width="384" height="128" />
        <rect x="96" y="320" width="320" height="32" />
        <rect x="160" y="352" width="192" height="32" />

        {/* Zampe sx */}
        <rect x="64" y="352" width="32" height="32" />
        <rect x="32" y="384" width="32" height="32" />
        <rect x="128" y="384" width="32" height="32" />
        <rect x="96" y="416" width="32" height="32" />
        <rect x="192" y="384" width="32" height="32" />
        <rect x="160" y="416" width="32" height="32" />
        {/* Zampe dx */}
        <rect x="416" y="352" width="32" height="32" />
        <rect x="448" y="384" width="32" height="32" />
        <rect x="352" y="384" width="32" height="32" />
        <rect x="384" y="416" width="32" height="32" />
        <rect x="288" y="384" width="32" height="32" />
        <rect x="320" y="416" width="32" height="32" />
      </g>

      {/* === OCCHI grandi (120×96) === */}
      <rect x="112" y="208" width="120" height="96" fill="#FFFFFF" />
      <rect x="280" y="208" width="120" height="96" fill="#FFFFFF" />

      {/* === DOLLARI grandi (5×7 cells × 12u = 60×84) === */}
      <g fill="var(--spike-eye, #05080F)">
        {/* === $ SINISTRO (origine 142, 214) === */}
        {/* row 0 — asta verticale top */}
        <rect x="166" y="214" width="12" height="12" />
        {/* row 1 — top S (cols 1,2,3) */}
        <rect x="154" y="226" width="36" height="12" />
        {/* row 2 — col 0 + col 2 (bordo sx + asta) */}
        <rect x="142" y="238" width="12" height="12" />
        <rect x="166" y="238" width="12" height="12" />
        {/* row 3 — centro S (cols 1,2,3) */}
        <rect x="154" y="250" width="36" height="12" />
        {/* row 4 — col 2 + col 4 (asta + bordo dx) */}
        <rect x="166" y="262" width="12" height="12" />
        <rect x="190" y="262" width="12" height="12" />
        {/* row 5 — bottom S (cols 1,2,3) */}
        <rect x="154" y="274" width="36" height="12" />
        {/* row 6 — asta verticale bottom */}
        <rect x="166" y="286" width="12" height="12" />

        {/* === $ DESTRO (origine 310, 214) === */}
        <rect x="334" y="214" width="12" height="12" />
        <rect x="322" y="226" width="36" height="12" />
        <rect x="310" y="238" width="12" height="12" />
        <rect x="334" y="238" width="12" height="12" />
        <rect x="322" y="250" width="36" height="12" />
        <rect x="334" y="262" width="12" height="12" />
        <rect x="358" y="262" width="12" height="12" />
        <rect x="322" y="274" width="36" height="12" />
        <rect x="334" y="286" width="12" height="12" />
      </g>
    </svg>
  );
}
