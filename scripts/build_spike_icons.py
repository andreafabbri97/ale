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
    (112, 208, 120, 96),
    (280, 208, 120, 96),
]

DOLLAR_RECTS = [
    # $ sinistro (S 5x7 + asta verticale, cella = 12 unità)
    (166, 214, 12, 12),
    (154, 226, 36, 12),
    (142, 238, 12, 12), (166, 238, 12, 12),
    (154, 250, 36, 12),
    (166, 262, 12, 12), (190, 262, 12, 12),
    (154, 274, 36, 12),
    (166, 286, 12, 12),
    # $ destro
    (334, 214, 12, 12),
    (322, 226, 36, 12),
    (310, 238, 12, 12), (334, 238, 12, 12),
    (322, 250, 36, 12),
    (334, 262, 12, 12), (358, 262, 12, 12),
    (322, 274, 36, 12),
    (334, 286, 12, 12),
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
