interface SpikeIconProps {
  className?: string;
  size?: number | string;
  title?: string;
}

/**
 * Spike — granchio 8-bit con occhi a dollaro.
 * Pixel-art su viewBox 512: corpo/chele/zampe in cyan accent, occhi bianchi,
 * $ disegnato pixel-per-pixel (S a 5×7 con asta verticale).
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

      {/* === OCCHI (bianchi) === */}
      <rect x="144" y="216" width="96" height="80" fill="#FFFFFF" />
      <rect x="272" y="216" width="96" height="80" fill="#FFFFFF" />

      {/* === DOLLARI === */}
      {/* Ogni "pixel" del $ = 8×8 unità. Forma: S a 5w×7h con asta verticale al centro. */}
      <g fill="var(--spike-eye, #05080F)">
        {/* === $ SINISTRO (centrato a x=192) === */}
        {/* Origine (172, 228); cells: x0=172,x1=180,x2=188,x3=196,x4=204 */}
        {/* row 0 (y=228): asta verticale top */}
        <rect x="188" y="228" width="8" height="8" />
        {/* row 1 (y=236): top della S — cols 1,2,3 */}
        <rect x="180" y="236" width="24" height="8" />
        {/* row 2 (y=244): cols 0 (bordo sx S) + 2 (asta) */}
        <rect x="172" y="244" width="8" height="8" />
        <rect x="188" y="244" width="8" height="8" />
        {/* row 3 (y=252): centro della S — cols 1,2,3 */}
        <rect x="180" y="252" width="24" height="8" />
        {/* row 4 (y=260): cols 2 (asta) + 4 (bordo dx S) */}
        <rect x="188" y="260" width="8" height="8" />
        <rect x="204" y="260" width="8" height="8" />
        {/* row 5 (y=268): bottom della S — cols 1,2,3 */}
        <rect x="180" y="268" width="24" height="8" />
        {/* row 6 (y=276): asta verticale bottom */}
        <rect x="188" y="276" width="8" height="8" />

        {/* === $ DESTRO (centrato a x=320) === */}
        {/* Cells: x0=300,x1=308,x2=316,x3=324,x4=332 */}
        <rect x="316" y="228" width="8" height="8" />
        <rect x="308" y="236" width="24" height="8" />
        <rect x="300" y="244" width="8" height="8" />
        <rect x="316" y="244" width="8" height="8" />
        <rect x="308" y="252" width="24" height="8" />
        <rect x="316" y="260" width="8" height="8" />
        <rect x="332" y="260" width="8" height="8" />
        <rect x="308" y="268" width="24" height="8" />
        <rect x="316" y="276" width="8" height="8" />
      </g>
    </svg>
  );
}
