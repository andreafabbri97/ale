"""Genera le icone PNG (apple-touch-icon, icon-192, icon-512) dal disegno
pixel-art di Spike. Usa solo Pillow per evitare libcairo su Windows.

Eseguire dalla root noa-mvp:  python scripts/build_spike_icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

# ----- Geometria (stessa coords del file icon.svg, viewBox 512×512) -----
BG = "#05080F"
BODY = "#3BD4F8"
EYE_BG = "#FFFFFF"
EYE_FG = "#05080F"
RADIUS = 96  # rounded background

# Tutti i rect in formato (x, y, w, h) — sistema di riferimento 512×512
BODY_RECTS = [
    # Chele sx
    (32, 64, 64, 32), (32, 96, 32, 32), (96, 96, 32, 32), (64, 128, 64, 32),
    # Chele dx
    (416, 64, 64, 32), (448, 96, 32, 32), (384, 96, 32, 32), (384, 128, 64, 32),
    # Carapace
    (128, 160, 256, 32),
    (64, 192, 384, 128),
    (96, 320, 320, 32),
    (160, 352, 192, 32),
    # Zampe sx
    (64, 352, 32, 32), (32, 384, 32, 32),
    (128, 384, 32, 32), (96, 416, 32, 32),
    (192, 384, 32, 32), (160, 416, 32, 32),
    # Zampe dx
    (416, 352, 32, 32), (448, 384, 32, 32),
    (352, 384, 32, 32), (384, 416, 32, 32),
    (288, 384, 32, 32), (320, 416, 32, 32),
]

EYE_BG_RECTS = [
    (144, 216, 96, 80),
    (272, 216, 96, 80),
]

DOLLAR_RECTS = [
    # $ sinistro (S 5x7 + asta verticale, pixel = 8 unità)
    (188, 228, 8, 8),
    (180, 236, 24, 8),
    (172, 244, 8, 8), (188, 244, 8, 8),
    (180, 252, 24, 8),
    (188, 260, 8, 8), (204, 260, 8, 8),
    (180, 268, 24, 8),
    (188, 276, 8, 8),
    # $ destro
    (316, 228, 8, 8),
    (308, 236, 24, 8),
    (300, 244, 8, 8), (316, 244, 8, 8),
    (308, 252, 24, 8),
    (316, 260, 8, 8), (332, 260, 8, 8),
    (308, 268, 24, 8),
    (316, 276, 8, 8),
]


def render(size: int, with_bg: bool) -> Image.Image:
    """Renderizza Spike a `size`×`size` pixel. Scala lineare da 512."""
    scale = size / 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if with_bg:
        # Background arrotondato
        r = int(RADIUS * scale)
        draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=BG)

    def draw_rects(rects, color):
        for x, y, w, h in rects:
            x1 = int(x * scale)
            y1 = int(y * scale)
            x2 = int((x + w) * scale)
            y2 = int((y + h) * scale)
            draw.rectangle((x1, y1, x2 - 1, y2 - 1), fill=color)

    draw_rects(BODY_RECTS, BODY)
    draw_rects(EYE_BG_RECTS, EYE_BG)
    draw_rects(DOLLAR_RECTS, EYE_FG)
    return img


def main():
    out = Path(__file__).parent.parent / "public"
    out.mkdir(exist_ok=True)

    # PWA icons (con sfondo scuro arrotondato)
    render(192, with_bg=True).save(out / "icon-192.png", optimize=True)
    render(512, with_bg=True).save(out / "icon-512.png", optimize=True)

    # Apple touch icon (180×180, sempre con sfondo: iOS non gestisce trasparenza)
    render(180, with_bg=True).save(out / "apple-touch-icon.png", optimize=True)

    print("OK — icone generate in", out)


if __name__ == "__main__":
    main()
