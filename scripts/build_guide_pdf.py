"""
Genera la guida 'I 7 errori finanziari che fanno gli italiani' come PDF
in DUE varianti: dark theme (sfondo nero) e light theme (sfondo bianco).

Output:
  - public/guida-7-errori-finanziari-dark.pdf
  - public/guida-7-errori-finanziari-light.pdf

Run: python scripts/build_guide_pdf.py

Tono: didattico, sobrio, anti-promesse di guadagno. Ogni errore include
un esempio numerico concreto + azioni pratiche immediate.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Callable

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfgen.canvas import Canvas

LOGO_PATH = Path(__file__).parent.parent / "public" / "icon-512.png"


# ---------------------------------------------------------------------------
# THEMES
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Theme:
    name: str
    bg: HexColor
    bg_2: HexColor
    bg_3: HexColor
    accent: HexColor
    accent_2: HexColor
    text: HexColor
    text_dim: HexColor
    text_faint: HexColor
    border: Color
    danger: HexColor
    success: HexColor


DARK = Theme(
    name="dark",
    bg=HexColor("#05080F"),
    bg_2=HexColor("#0A1226"),
    bg_3=HexColor("#0F1B3D"),
    accent=HexColor("#3BD4F8"),
    accent_2=HexColor("#2C7BE5"),
    text=HexColor("#F5F8FF"),
    text_dim=HexColor("#A8B3CF"),
    text_faint=HexColor("#5C6789"),
    border=Color(1, 1, 1, alpha=0.10),
    danger=HexColor("#E74C3C"),
    success=HexColor("#2ECC71"),
)

LIGHT = Theme(
    name="light",
    bg=HexColor("#FFFFFF"),
    bg_2=HexColor("#F8FAFC"),
    bg_3=HexColor("#EFF6FF"),
    accent=HexColor("#2C7BE5"),
    accent_2=HexColor("#1E40AF"),
    text=HexColor("#0F172A"),
    text_dim=HexColor("#334155"),
    text_faint=HexColor("#94A3B8"),
    border=Color(0, 0, 0, alpha=0.12),
    danger=HexColor("#DC2626"),
    success=HexColor("#16A34A"),
)


# ---------------------------------------------------------------------------
# STYLES (parametrizzati per tema)
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Styles:
    h1: ParagraphStyle
    h2: ParagraphStyle
    h3: ParagraphStyle
    eyebrow: ParagraphStyle
    body: ParagraphStyle
    lead: ParagraphStyle
    quote: ParagraphStyle
    disclaimer: ParagraphStyle
    cover_title: ParagraphStyle
    cover_sub: ParagraphStyle
    cover_footer: ParagraphStyle


def make_styles(t: Theme) -> Styles:
    base = getSampleStyleSheet()
    body = ParagraphStyle(
        "Body",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=17,
        textColor=t.text_dim,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
    )
    return Styles(
        h1=ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=30,
            leading=36,
            textColor=t.text,
            spaceAfter=14,
            spaceBefore=0,
            keepWithNext=1,
        ),
        h2=ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=26,
            textColor=t.text,
            spaceAfter=10,
            spaceBefore=14,
            keepWithNext=1,
        ),
        h3=ParagraphStyle(
            "H3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=18,
            textColor=t.accent,
            spaceAfter=6,
            spaceBefore=12,
            keepWithNext=1,
        ),
        eyebrow=ParagraphStyle(
            "Eyebrow",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=12,
            textColor=t.accent,
            spaceAfter=6,
            keepWithNext=1,
        ),
        body=body,
        lead=ParagraphStyle(
            "Lead",
            parent=body,
            fontSize=13,
            leading=20,
            textColor=t.text,
            spaceAfter=14,
        ),
        quote=ParagraphStyle(
            "Quote",
            parent=body,
            fontSize=12,
            leading=18,
            leftIndent=18,
            rightIndent=18,
            textColor=t.text,
            fontName="Helvetica-Oblique",
            spaceBefore=10,
            spaceAfter=14,
        ),
        disclaimer=ParagraphStyle(
            "Disclaimer",
            parent=body,
            fontSize=8,
            leading=12,
            textColor=t.text_faint,
            alignment=TA_LEFT,
        ),
        cover_title=ParagraphStyle(
            "CoverTitle",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=38,
            leading=44,
            alignment=TA_CENTER,
            textColor=t.text,
        ),
        cover_sub=ParagraphStyle(
            "CoverSub",
            parent=body,
            alignment=TA_CENTER,
            fontSize=14,
            leading=20,
            textColor=t.text_dim,
        ),
        cover_footer=ParagraphStyle(
            "CoverFooter",
            parent=body,
            alignment=TA_CENTER,
            fontSize=9,
            textColor=t.text_faint,
        ),
    )


# ---------------------------------------------------------------------------
# PAGE BACKGROUNDS
# ---------------------------------------------------------------------------
def background_painter(t: Theme, with_footer: bool = True) -> Callable:
    def _paint(canvas: Canvas, doc) -> None:
        canvas.saveState()
        canvas.setFillColor(t.bg)
        canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)

        canvas.setStrokeColor(t.accent)
        canvas.setLineWidth(3)
        canvas.line(0, A4[1] - 4, A4[0], A4[1] - 4)

        if with_footer:
            if LOGO_PATH.exists():
                canvas.drawImage(
                    str(LOGO_PATH),
                    2 * cm,
                    1.0 * cm,
                    width=8 * mm,
                    height=8 * mm,
                    mask="auto",
                )
            canvas.setFont("Helvetica", 8)
            canvas.setFillColor(t.text_faint)
            canvas.drawString(
                2 * cm + 10 * mm, 1.2 * cm, "Spike — Educazione finanziaria"
            )
            canvas.drawRightString(A4[0] - 2 * cm, 1.2 * cm, f"Pag. {doc.page}")
            canvas.setStrokeColor(t.border)
            canvas.setLineWidth(0.5)
            canvas.line(2 * cm, 1.8 * cm, A4[0] - 2 * cm, 1.8 * cm)
        canvas.restoreState()

    return _paint


def cover_painter(t: Theme) -> Callable:
    def _paint(canvas: Canvas, doc) -> None:
        canvas.saveState()
        canvas.setFillColor(t.bg)
        canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)
        # Decorazione: glow radiale accent in alto a destra
        for r, alpha in [(180, 0.04), (140, 0.06), (100, 0.10), (60, 0.18)]:
            c = Color(t.accent_2.red, t.accent_2.green, t.accent_2.blue, alpha=alpha)
            canvas.setFillColor(c)
            canvas.circle(A4[0] - 60, A4[1] - 80, r, stroke=0, fill=1)
        canvas.setStrokeColor(t.accent)
        canvas.setLineWidth(3)
        canvas.line(0, A4[1] - 4, A4[0], A4[1] - 4)
        canvas.restoreState()

    return _paint


# ---------------------------------------------------------------------------
# BOX HELPERS
# ---------------------------------------------------------------------------
def callout(
    text_html: str,
    s: Styles,
    t: Theme,
    color: HexColor | None = None,
    bg_alpha: float | None = None,
) -> KeepTogether:
    color = color or t.accent
    bg_alpha = bg_alpha if bg_alpha is not None else (0.10 if t.name == "light" else 0.08)
    p = Paragraph(text_html, s.body)
    bg = Color(color.red, color.green, color.blue, alpha=bg_alpha)
    tbl = Table([[p]], colWidths=[16 * cm])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 1, color),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return KeepTogether([tbl])


def action_box(title: str, items: list[str], s: Styles, t: Theme) -> KeepTogether:
    """Box 'Cosa fare questa settimana' — sfondo success leggero."""
    item_style = ParagraphStyle(
        "ActionItem",
        parent=s.body,
        fontSize=10,
        leading=14,
        spaceAfter=3,
        alignment=TA_LEFT,
        leftIndent=10,
        bulletIndent=0,
    )
    body_flowables: list = [
        Paragraph(
            f'<font color="{t.success.hexval()}"><b>{title}</b></font>', s.body
        )
    ]
    for it in items:
        body_flowables.append(Paragraph(f"&bull; {it}", item_style))

    bg = Color(t.success.red, t.success.green, t.success.blue, alpha=0.08)
    tbl = Table([[body_flowables]], colWidths=[16 * cm])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 1, t.success),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return KeepTogether([tbl])


def example_box(text_html: str, s: Styles, t: Theme) -> KeepTogether:
    """Box 'Esempio numerico' — sfondo accent_2 leggero."""
    bg = Color(t.accent_2.red, t.accent_2.green, t.accent_2.blue, alpha=0.08)
    p = Paragraph(
        f'<font color="{t.accent.hexval()}"><b>ESEMPIO NUMERICO</b></font><br/><br/>'
        + text_html,
        s.body,
    )
    tbl = Table([[p]], colWidths=[16 * cm])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 1, t.accent_2),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return KeepTogether([tbl])


def scenarios_table(rows: list[tuple[str, str, str]], s: Styles, t: Theme) -> KeepTogether:
    th = ParagraphStyle(
        "TH",
        parent=s.body,
        textColor=t.accent,
        fontName="Helvetica-Bold",
        fontSize=10,
        alignment=TA_CENTER,
    )
    td = ParagraphStyle(
        "TD",
        parent=s.body,
        textColor=t.text,
        fontName="Helvetica-Bold",
        fontSize=12,
        alignment=TA_CENTER,
    )
    tl = ParagraphStyle(
        "TL",
        parent=s.body,
        textColor=t.text_dim,
        alignment=TA_CENTER,
        fontSize=8,
    )
    data = [
        [
            Paragraph("RENDIMENTO", th),
            Paragraph("VALORE FINALE", th),
            Paragraph("SCENARIO", th),
        ]
    ]
    for rate, value, label in rows:
        data.append(
            [Paragraph(rate, td), Paragraph(value, td), Paragraph(label, tl)]
        )
    tbl = Table(data, colWidths=[5 * cm, 5.5 * cm, 5.5 * cm])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), t.bg_3),
                ("BACKGROUND", (0, 1), (-1, -1), t.bg_2),
                ("BOX", (0, 0), (-1, -1), 1, t.border),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, t.border),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return KeepTogether([tbl])


# ---------------------------------------------------------------------------
# STORY
# ---------------------------------------------------------------------------
def build_story(t: Theme, s: Styles) -> list:
    story: list = []

    # ====== COVER ======
    story.append(Spacer(1, 2.5 * cm))
    if LOGO_PATH.exists():
        logo = Image(str(LOGO_PATH), width=4.5 * cm, height=4.5 * cm)
        logo.hAlign = "CENTER"
        story.append(logo)
        story.append(Spacer(1, 1 * cm))
    story.append(Paragraph("SPIKE · GUIDA GRATUITA", s.eyebrow))
    story.append(Spacer(1, 0.6 * cm))
    story.append(
        Paragraph(
            "I 7 errori finanziari<br/>"
            f'<font color="{t.accent.hexval()}">che fanno gli italiani</font>',
            s.cover_title,
        )
    )
    story.append(Spacer(1, 0.8 * cm))
    story.append(
        Paragraph(
            "Cosa nessuno ci ha mai insegnato a scuola<br/>"
            "su debiti, risparmi, inflazione e investimenti.",
            s.cover_sub,
        )
    )
    story.append(Spacer(1, 3 * cm))
    story.append(
        Paragraph(
            "A cura di Spike — Educazione finanziaria, trading, investimenti",
            s.cover_footer,
        )
    )
    story.append(PageBreak())

    # ====== COME USARE QUESTA GUIDA ======
    story.append(Paragraph("PRIMA DI INIZIARE", s.eyebrow))
    story.append(Paragraph("Come usare questa guida", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Questa guida è breve di proposito (circa 20 minuti di lettura). "
            "Ogni errore segue la stessa struttura, così puoi anche saltare a quello "
            "che ti interessa di più senza perderti.",
            s.lead,
        )
    )
    story.append(Paragraph("Per ogni errore trovi:", s.h3))
    story.append(
        Paragraph(
            "&bull; <b>Il problema</b>: cosa fanno (male) la maggior parte degli italiani.<br/>"
            "&bull; <b>Perché è un errore</b>: i meccanismi sottostanti, spiegati semplici.<br/>"
            "&bull; <b>Esempio numerico</b>: cifre concrete, non astrazioni.<br/>"
            "&bull; <b>Cosa fare questa settimana</b>: 3-4 azioni pratiche immediate.<br/>",
            s.body,
        )
    )
    story.append(Spacer(1, 0.4 * cm))
    story.append(
        callout(
            "<b>Una regola sola, valida per tutta la guida:</b><br/>"
            "Prima si studia, poi si decide. Niente di quello che leggi qui è un "
            "consiglio personalizzato. Per decisioni importanti rivolgiti a un "
            "consulente finanziario abilitato CONSOB.",
            s,
            t,
            color=t.accent,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 1
    # ===========================================================
    story.append(Paragraph("ERRORE 1 di 7", s.eyebrow))
    story.append(Paragraph('Confondere "debito buono" e "debito cattivo"', s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Quando senti la parola \"debito\", il riflesso è negativo. In realtà non "
            "tutti i debiti sono uguali. La distinzione è semplice e fa la differenza "
            "tra avere strumenti in mano e averli contro.",
            s.lead,
        )
    )
    story.append(Paragraph("Debiti cattivi", s.h3))
    story.append(
        Paragraph(
            "Fanno spendere oggi soldi che non hai per cose che <b>perdono valore</b> "
            "nel tempo: auto nuova in 7 anni, smartphone a rate, vacanza con carta "
            "revolving, elettrodomestico finanziato senza necessità. Paghi interessi, "
            "riduci la liquidità futura, e l'oggetto vale sempre meno.",
            s.body,
        )
    )
    story.append(Paragraph("Debiti buoni", s.h3))
    story.append(
        Paragraph(
            "Permettono di acquistare o costruire qualcosa che <b>genera valore</b> "
            "o lo mantiene: mutuo prima casa sostenibile, formazione professionale con "
            "ritorno chiaro, finanziamento per un'attività con business plan solido. "
            "Non sono garanzia di guadagno, sono strumenti.",
            s.body,
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        example_box(
            "Smartphone da <b>1.200 €</b> finanziato in 24 rate a TAEG 14%. "
            "Rate da circa 57,40 €/mese. <b>Costo totale: ~1.378 €</b> = 178 € di "
            "interessi pagati per un oggetto che dopo 2 anni vale circa 400 €. "
            "Sommando deprezzamento + interessi, <b>perdita reale di ~978 €</b> "
            "su una scelta di 5 secondi al checkout.",
            s,
            t,
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        callout(
            "<b>Dati Banca d'Italia:</b> oltre la metà del debito delle famiglie "
            "italiane è classificato come \"debito al consumo\". È il segnale di una "
            "società che usa il credito per spendere, non per costruire.",
            s,
            t,
            color=t.accent_2,
            bg_alpha=0.08,
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Lista mentale di tutti i debiti in corso (rate, finanziamenti, "
                "revolving) — quanto pesa in % sul reddito mensile?",
                "Per ognuno chiediti: questo debito mi sta facendo costruire o "
                "consumare?",
                "Se hai una revolving attiva (TAEG spesso 18-22%), valuta di "
                "estinguerla prima di qualsiasi investimento.",
                "Per i prossimi 30 giorni: nessun nuovo acquisto rateizzato "
                "non essenziale.",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 2
    # ===========================================================
    story.append(Paragraph("ERRORE 2 di 7", s.eyebrow))
    story.append(Paragraph("Lasciare i risparmi fermi sul conto", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "L'inflazione è la tassa silenziosa più costosa che esiste. Non la vedi "
            "in busta paga, ma erode il potere d'acquisto dei tuoi risparmi ogni anno.",
            s.lead,
        )
    )
    story.append(
        Paragraph(
            "Negli ultimi anni in Italia abbiamo visto inflazione media tra il 2% e "
            "l'8% annuo, con picchi su energia (+34%), alimentari (+24%) e trasporti. "
            "Tradotto: i tuoi euro \"fermi\" comprano sempre meno cose.",
            s.body,
        )
    )
    story.append(
        example_box(
            "<b>10.000 €</b> lasciati sul conto corrente nel 2020 valgono, in termini "
            "reali, circa <b>8.500 €</b> oggi. Sul saldo bancario leggi sempre 10.000, "
            "ma con quei soldi compri il 15% in meno di prima. Hai pagato una "
            "<b>\"tassa\" invisibile di 1.500 €</b> senza accorgertene.",
            s,
            t,
        )
    )
    story.append(Paragraph("Cosa NON significa", s.h3))
    story.append(
        Paragraph(
            "<b>Non significa</b> che devi investire tutto in borsa domani. Una "
            "parte di liquidità è sana (fondo emergenza, spese previste). Significa "
            "che il \"conto corrente come deposito di valore\" è un'illusione.",
            s.body,
        )
    )
    story.append(Paragraph("Strumenti che almeno proteggono dall'inflazione", s.h3))
    story.append(
        Paragraph(
            "&bull; <b>Conti deposito vincolati</b>: tassi netti tipicamente 2-4% "
            "(verifica IVASS/banca, prodotti garantiti FITD fino a 100.000 €).<br/>"
            "&bull; <b>BTP Italia / BTP€i</b>: titoli di Stato indicizzati "
            "all'inflazione italiana o europea.<br/>"
            "&bull; <b>ETF obbligazionari short-term</b>: diversificazione + "
            "liquidità quotidiana.<br/>"
            "&bull; <b>ETF azionari globali</b> (es. MSCI World): orizzonte "
            "minimo 7-10 anni, volatilità elevata, ma storicamente battono "
            "l'inflazione.",
            s.body,
        )
    )
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Calcola quanti soldi tieni \"fermi\" sul conto corrente (oltre "
                "il fondo emergenza).",
                "Se sono > 3 mensilità di stipendio, è probabilmente troppo.",
                "Apri un confronto su almeno 3 conti deposito (es. portali "
                "comparatori indipendenti).",
                "Studia cos'è un BTP€i — anche senza acquistarlo, sapere come "
                "funziona vale come investimento di tempo.",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 3
    # ===========================================================
    story.append(Paragraph("ERRORE 3 di 7", s.eyebrow))
    story.append(Paragraph("Sottovalutare l'interesse composto", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Einstein lo definì \"l'ottava meraviglia del mondo\". Non perché sia "
            "magia, ma perché la maggior parte delle persone <b>non lo sente</b> "
            "finché non lo vede in numeri concreti, su un orizzonte lungo.",
            s.lead,
        )
    )
    story.append(
        Paragraph(
            "Esempio puramente didattico: <b>50 €/mese versati per 30 anni</b>. "
            "Totale versato: <b>18.000 €</b>. Come cambia il capitale finale in "
            "funzione del rendimento medio annuo composto:",
            s.body,
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        scenarios_table(
            [
                ("3% / anno", "€ 29.137", "Scenario prudente"),
                ("5% / anno", "€ 41.612", "Scenario moderato"),
                ("7% / anno", "€ 60.900", "Scenario crescita"),
            ],
            s,
            t,
        )
    )
    story.append(Spacer(1, 0.4 * cm))
    story.append(Paragraph("La variabile più potente è il TEMPO", s.h3))
    story.append(
        Paragraph(
            "Stesso esempio (50 €/mese al 7% annuo) ma con orizzonti diversi:",
            s.body,
        )
    )
    story.append(
        scenarios_table(
            [
                ("10 anni", "€ 8.700", "Versato: 6.000 €"),
                ("20 anni", "€ 26.200", "Versato: 12.000 €"),
                ("40 anni", "€ 132.300", "Versato: 24.000 €"),
            ],
            s,
            t,
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        example_box(
            "Anna inizia a 25 anni con 100 €/mese al 6% per 40 anni → "
            "<b>~200.000 €</b> (versato: 48.000 €).<br/>"
            "Marco inizia a 35 anni con il <b>doppio</b> (200 €/mese) al 6% per "
            "30 anni → <b>~201.000 €</b> (versato: 72.000 €).<br/>"
            "Stesso risultato ma Marco ha versato 24.000 € in più. "
            "<b>Iniziare presto vale più che versare di più.</b>",
            s,
            t,
        )
    )
    story.append(
        callout(
            "<b>Disclaimer matematico:</b> esempi didattici. Il rendimento reale "
            "dipende da costi, fiscalità, inflazione, periodo di mercato e rischio "
            "assunto. L'S&amp;P 500 ha reso storicamente 7-9% lordo annuo, ma con "
            "periodi anche fortemente negativi. Le performance passate non "
            "garantiscono risultati futuri.",
            s,
            t,
            color=t.danger,
        )
    )
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Apri un foglio di calcolo (anche Google Sheets) e simula: "
                "100 €/mese × X anni × Y% rendimento.",
                "Impara la \"regola del 72\": 72 / tasso% = anni per raddoppiare "
                "il capitale (es. al 6% raddoppi in 12 anni).",
                "Se hai un PAC già attivo, controlla: quanto stai versando, "
                "qual è il TER (costo) dello strumento.",
                "Se non hai un PAC e hai 30+ anni di orizzonte, è il momento "
                "di studiare come si costruisce.",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 4
    # ===========================================================
    story.append(Paragraph("ERRORE 4 di 7", s.eyebrow))
    story.append(Paragraph("Vivere solo in un quadrante", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Robert Kiyosaki ha divulgato il <i>Cashflow Quadrant</i>: un modo "
            "semplice di vedere da dove arrivano i soldi delle persone. Non è una "
            "legge scientifica, è una mappa. Ma rende molto chiaro un concetto.",
            s.lead,
        )
    )

    # Quadrante 2x2
    cell_h = ParagraphStyle(
        "QH", parent=s.body, fontName="Helvetica-Bold", fontSize=12,
        textColor=t.text, alignment=TA_CENTER, spaceAfter=2,
    )
    cell_s = ParagraphStyle(
        "QS", parent=s.body, fontSize=9, textColor=t.text_dim, alignment=TA_CENTER,
    )
    cell_p = ParagraphStyle(
        "QP", parent=s.body, fontName="Helvetica-Bold", fontSize=10,
        textColor=t.accent, alignment=TA_CENTER,
    )

    def quad_cell(name: str, pct: str, desc: str) -> list:
        return [
            Paragraph(pct, cell_p),
            Paragraph(name.upper(), cell_h),
            Paragraph(desc, cell_s),
        ]

    cells = [
        ("Dipendente", "~60%", "Scambia tempo per uno stipendio fisso"),
        ("Imprenditore", "~4%", "Possiede sistemi che lavorano per lui"),
        ("Autonomo", "~35%", "Possiede un lavoro, non un'azienda"),
        ("Investitore", "~1%", "Mette il capitale a generare reddito"),
    ]
    sub_tables = []
    for name, pct, desc in cells:
        c = Table([quad_cell(name, pct, desc)], colWidths=[8 * cm])
        c.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), t.bg_2),
                    ("BOX", (0, 0), (-1, -1), 1, t.border),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ]
            )
        )
        sub_tables.append(c)
    quad = Table(
        [[sub_tables[0], sub_tables[1]], [sub_tables[2], sub_tables[3]]],
        colWidths=[8.2 * cm, 8.2 * cm],
    )
    quad.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(KeepTogether([quad]))
    story.append(Spacer(1, 0.5 * cm))
    story.append(
        Paragraph(
            "Le percentuali sono indicative (non ISTAT). Il concetto regge: la "
            "stragrande maggioranza passa la vita scambiando ore per soldi. Quando "
            "smetti di lavorare, smettono i soldi.",
            s.body,
        )
    )
    story.append(
        Paragraph(
            "<b>Non c'è niente di sbagliato</b> nell'essere dipendente o autonomo. "
            "La trappola è <b>conoscerne uno solo</b>. Capire come funzionano gli "
            "altri — anche solo come consumatore consapevole di prodotti finanziari "
            "— cambia la prospettiva sulla gestione del denaro.",
            s.body,
        )
    )
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Identifica in quale quadrante sei oggi (puoi essere in più di uno).",
                "Calcola: se smettessi di lavorare domani, quanti mesi resisteresti "
                "con i risparmi attuali?",
                "Scegli un quadrante in cui vuoi mettere un piede: investitore "
                "(anche piccolo PAC), autonomo (freelance side), imprenditore.",
                "Dedica 1 ora a settimana a leggere/studiare quel quadrante. "
                "Per 12 mesi.",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 5
    # ===========================================================
    story.append(Paragraph("ERRORE 5 di 7", s.eyebrow))
    story.append(Paragraph("Investire senza un fondo emergenza", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "È un classico: leggi di crypto, di azioni, di ETF, ti convinci che è "
            "il momento di \"far fruttare i risparmi\" e investi tutto il poco che "
            "hai. Poi succede l'imprevisto: la lavatrice, l'auto, una visita medica, "
            "un mese senza lavoro. E devi disinvestire al momento peggiore, magari "
            "in perdita.",
            s.lead,
        )
    )
    story.append(Paragraph("La regola dei 3-6 mesi", s.h3))
    story.append(
        Paragraph(
            "Prima ancora di investire, costruisci un <b>fondo emergenza</b> pari "
            "a 3-6 mesi delle tue <b>spese essenziali</b> (affitto/mutuo, bollette, "
            "cibo, trasporti). Conservato in strumento liquido a basso rischio: "
            "conto corrente dedicato, conto deposito non vincolato, libretto postale.",
            s.body,
        )
    )
    story.append(
        Paragraph(
            "Non è una somma che \"rende\". È una somma che ti permette di "
            "<b>non disinvestire</b> i tuoi investimenti reali quando arriva "
            "l'imprevisto. È la cintura di sicurezza che ti permette di guidare "
            "più tranquillo.",
            s.body,
        )
    )
    story.append(
        example_box(
            "Spese essenziali mensili: <b>1.500 €</b> (affitto 600 + utenze 150 + "
            "cibo 350 + trasporti 200 + altre 200).<br/>"
            "Fondo emergenza target: <b>4.500 € – 9.000 €</b> (3-6 mesi).<br/>"
            "Risparmiando 200 €/mese ci metti tra <b>23 e 45 mesi</b> a "
            "costruirlo. È ok prendersi 2 anni: meglio costruirlo bene che "
            "investire e dover liquidare in panico.",
            s,
            t,
        )
    )
    story.append(Paragraph("Dove tenerlo", s.h3))
    story.append(
        Paragraph(
            "<b>Sì:</b> conto corrente separato dal principale, conto deposito non "
            "vincolato, libretto postale.<br/>"
            "<b>No:</b> azioni, crypto, ETF, qualsiasi cosa con orizzonte > 0. "
            "L'emergenza per definizione non aspetta il momento giusto del mercato.",
            s.body,
        )
    )
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Apri un foglio di calcolo: lista delle spese essenziali mensili "
                "(solo essenziali, non Netflix né palestra).",
                "Moltiplica per 3 = il tuo target minimo. Per 6 = target ideale.",
                "Apri un conto separato (anche online, gratuito) per parcheggiare "
                "il fondo.",
                "Imposta un bonifico automatico di 100-300 €/mese fino a target "
                "raggiunto.",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 6
    # ===========================================================
    story.append(Paragraph("ERRORE 6 di 7", s.eyebrow))
    story.append(Paragraph('Imitare i "guru" senza formazione', s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Su Instagram, TikTok, YouTube ci sono migliaia di profili che vendono "
            "il sogno: \"trade da copiare\", \"segnali vincenti\", \"crypto che "
            "esploderanno\", \"strategie da 10K al mese\". La maggior parte sono "
            "persone che guadagnano <b>vendendoti il sogno</b>, non investendo davvero.",
            s.lead,
        )
    )
    story.append(Paragraph("3 red flag da riconoscere subito", s.h3))
    story.append(
        Paragraph(
            "&bull; <b>Promesse di guadagno specifiche</b>: \"x% al mese garantito\", "
            "\"in 6 mesi raddoppi\". Chi è davvero capace <i>non promette risultati "
            "certi: li relativizza</i>.<br/>"
            "&bull; <b>Stile di vita esibito</b>: macchine, orologi, hotel di lusso "
            "usati come prova di competenza. La vera competenza si misura in "
            "<b>track record verificabili</b>, non in foto.<br/>"
            "&bull; <b>Pressione all'azione veloce</b>: \"posti limitati\", \"offerta "
            "che scade\". Le decisioni finanziarie buone raramente hanno urgenza.",
            s.body,
        )
    )
    story.append(Paragraph("Come verificare un educatore serio", s.h3))
    story.append(
        Paragraph(
            "&bull; <b>Albo CONSOB / OCF</b>: se vende consigli personalizzati, "
            "deve essere iscritto (consob.it / organismocf.it). Verificabile "
            "gratis online.<br/>"
            "&bull; <b>Disclaimer chiari</b>: chi è serio scrive sempre \"performance "
            "passate non garantiscono risultati futuri\", \"contenuto formativo\", "
            "ecc.<br/>"
            "&bull; <b>Coerenza nel tempo</b>: guarda contenuti di 3 anni fa. "
            "Diceva le stesse cose? Le sue previsioni si sono avverate? Quanti "
            "errori ha ammesso pubblicamente?<br/>"
            "&bull; <b>Costi trasparenti</b>: prezzo del corso visibile prima "
            "di iscriversi a webinar gratuiti. Se il prezzo è nascosto fino "
            "alla call \"di vendita\", è un'occasione per chiedersi perché.",
            s.body,
        )
    )
    story.append(
        callout(
            "<b>Una regola pratica:</b> se un contenuto ti spinge a sentirti "
            "stupido per non aver agito subito (\"stai perdendo il treno!\"), "
            "stai assistendo a una <b>vendita</b>, non a un'educazione.",
            s,
            t,
            color=t.danger,
        )
    )
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Smetti di seguire 3 profili che ti hanno fatto sentire \"in "
                "ritardo\" o \"stupido\" almeno una volta.",
                "Verifica su consob.it / organismocf.it se i \"guru\" che segui "
                "sono abilitati.",
                "Cerca un libro di finanza personale (autori italiani: Renato "
                "Carlucci, John C. Bogle tradotto, Burton Malkiel). Leggi 20 "
                "pagine prima di guardare il prossimo reel.",
                "Per ogni \"opportunità\" che ti viene presentata, dormici sopra "
                "almeno 48h. Sempre.",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # ERRORE 7
    # ===========================================================
    story.append(Paragraph("ERRORE 7 di 7", s.eyebrow))
    story.append(Paragraph("Mettere tutte le uova nello stesso paniere", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "È la regola di buon senso più antica della finanza, ed è anche la più "
            "violata. Quando ci appassioniamo a un'idea — un'azienda, una crypto, "
            "un settore — la tentazione di concentrarci lì è fortissima. \"Se ci "
            "credo, ci metto tutto.\" Risultato: quando va male, va male su tutto.",
            s.lead,
        )
    )
    story.append(Paragraph("Diversificazione, in concreto", s.h3))
    story.append(
        Paragraph(
            "Non è un termine tecnico complicato. Significa distribuire il rischio "
            "su <b>più asset diversi</b> che reagiscono in modi diversi alle stesse "
            "condizioni di mercato. Tipicamente per area geografica, per settore "
            "industriale e per tipo di strumento (azioni, obbligazioni, materie "
            "prime, immobili, liquidità).",
            s.body,
        )
    )
    story.append(
        example_box(
            "Portafoglio \"da manuale\" molto semplice (solo esempio didattico, "
            "non un consiglio):<br/>"
            "&bull; <b>60%</b> ETF azionario globale (es. MSCI World)<br/>"
            "&bull; <b>30%</b> ETF obbligazionario aggregato globale<br/>"
            "&bull; <b>10%</b> liquidità / conto deposito / oro<br/><br/>"
            "Con 10.000 €: 6.000 azionario + 3.000 obbligazionario + 1.000 "
            "liquidità. Il profilo di rischio va personalizzato con un consulente "
            "in base all'orizzonte temporale e alla tolleranza individuale.",
            s,
            t,
        )
    )
    story.append(Paragraph('Attenzione alla concentrazione "nascosta"', s.h3))
    story.append(
        Paragraph(
            "&bull; Se la tua <b>casa</b> è la tua ricchezza principale → sei "
            "concentrato sull'immobiliare italiano.<br/>"
            "&bull; Se il tuo <b>TFR</b> è investito in azioni della tua azienda → "
            "sei concentrato 2 volte (lavoro + investimento sulla stessa società).<br/>"
            "&bull; Se i tuoi risparmi sono solo in <b>BTP italiani</b> → sei "
            "concentrato sul rischio sovrano italiano.<br/>"
            "&bull; Se hai solo <b>fondi comuni della tua banca</b> → spesso sono "
            "tutti azionari italiani o europei con commissioni alte.",
            s.body,
        )
    )
    story.append(
        callout(
            "Tutto plausibile, niente di sbagliato in sé — ma <b>esserne "
            "consapevoli</b> cambia le decisioni che prendi.",
            s,
            t,
        )
    )
    story.append(
        action_box(
            "Cosa fare questa settimana",
            [
                "Fai una lista di TUTTO il tuo patrimonio (casa, conto, TFR, "
                "investimenti, polizze, crypto...) con il valore stimato.",
                "Calcola in % quanto pesa ogni voce. C'è qualcosa > 40-50% del "
                "totale?",
                "Per ogni concentrazione > 40% chiediti: è una scelta consapevole "
                "o è capitato così?",
                "Se hai > 10% del patrimonio in una singola crypto o azione: "
                "valuta di ridurre. Non è \"perdere il treno\", è \"non perdere tutto\".",
            ],
            s,
            t,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # BONUS: FORMULE E STRUMENTI
    # ===========================================================
    story.append(Paragraph("BONUS", s.eyebrow))
    story.append(Paragraph("Formule e strumenti che dovresti conoscere", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "5 strumenti mentali (gratis) che cambiano il modo in cui ragioni "
            "sui soldi. Memorizzali — valgono più di mille reel.",
            s.lead,
        )
    )

    story.append(Paragraph("1. Regola del 72", s.h3))
    story.append(
        Paragraph(
            "<b>72 ÷ tasso % = anni per raddoppiare il capitale.</b><br/>"
            "Es. al 6% raddoppi in 12 anni. Al 9% in 8 anni. Al 3% in 24 anni. "
            "Funziona anche al contrario per l'inflazione: al 6% di inflazione "
            "i tuoi soldi dimezzano in 12 anni.",
            s.body,
        )
    )

    story.append(Paragraph("2. Regola del 4% (FIRE)", s.h3))
    story.append(
        Paragraph(
            "<b>Capitale × 4% = quanto puoi prelevare l'anno senza esaurirlo "
            "(orizzonte 30 anni).</b><br/>"
            "Per vivere con 20.000 €/anno servono circa <b>500.000 €</b> investiti. "
            "Per 30.000 €/anno → 750.000 €. È la regola base per chi pensa "
            "all'indipendenza finanziaria.",
            s.body,
        )
    )

    story.append(Paragraph("3. 50 / 30 / 20", s.h3))
    story.append(
        Paragraph(
            "Suddivisione classica del netto mensile: <b>50% bisogni</b> (affitto, "
            "spesa, bollette), <b>30% desideri</b> (svaghi, ristoranti, hobby), "
            "<b>20% risparmio/investimento</b>. Se sei sotto il 20% di risparmio, "
            "vale la pena rivedere le voci.",
            s.body,
        )
    )

    story.append(Paragraph("4. TER (Total Expense Ratio)", s.h3))
    story.append(
        Paragraph(
            "Costo annuo di un fondo o ETF, espresso in %. Un fondo della banca al "
            "<b>2% TER</b> ti costa il 2% all'anno, ogni anno, indipendentemente dai "
            "rendimenti. Un ETF passivo ha TER tipicamente <b>0,1-0,3%</b>. Su "
            "30 anni la differenza è enorme.",
            s.body,
        )
    )

    story.append(Paragraph("5. Costo orario reale", s.h3))
    story.append(
        Paragraph(
            "Prima di un acquisto importante, dividi il prezzo per il tuo "
            "stipendio orario netto. <b>iPhone da 1.200 €</b> ÷ <b>12 €/h</b> "
            "= 100 ore di lavoro. \"Mi conviene davvero scambiare 100 ore della "
            "mia vita per questo?\" è una domanda che cambia molte decisioni.",
            s.body,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # CHECKLIST FINALE
    # ===========================================================
    story.append(Paragraph("CHECKLIST PERSONALE", s.eyebrow))
    story.append(Paragraph("Il tuo punto di partenza", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Stampa questa pagina (o ricopiala su un foglio) e spunta cosa hai "
            "già fatto. Quello che non è spuntato è il tuo prossimo passo.",
            s.lead,
        )
    )

    checklist_items = [
        ("BASE", "Conosco con precisione le mie spese mensili essenziali"),
        ("BASE", "Ho un foglio dove segno entrate e uscite ogni mese"),
        ("BASE", "Ho un conto corrente separato per il fondo emergenza"),
        ("BASE", "Ho un fondo emergenza pari ad almeno 3 mesi di spese"),
        ("DEBITI", "Ho la lista di tutti i miei debiti con TAEG e scadenza"),
        ("DEBITI", "Nessuno dei miei debiti è una revolving / carta a rate ad alto TAEG"),
        ("DEBITI", "Per ogni nuovo acquisto > 500 € applico la regola dei 30 giorni"),
        ("PROTEZIONE", "Conosco la differenza tra inflazione nominale e reale"),
        ("PROTEZIONE", "Non tengo > 6 mesi di spese sul conto corrente non remunerato"),
        ("PROTEZIONE", "So cosa sono BTP€i e conti deposito (anche se non li uso)"),
        ("CRESCITA", "Ho un orizzonte temporale chiaro per i miei risparmi"),
        ("CRESCITA", "So la differenza tra fondo a gestione attiva ed ETF passivo"),
        ("CRESCITA", "Conosco il TER degli strumenti che uso"),
        ("CRESCITA", "Ho un PAC attivo o so come crearlo"),
        ("MENTALITÀ", "Nessun \"guru\" su Instagram guida le mie decisioni"),
        ("MENTALITÀ", "Verifico CONSOB/OCF prima di seguire consigli personalizzati"),
        ("MENTALITÀ", "Non investo MAI denaro che non posso permettermi di perdere"),
        ("MENTALITÀ", "Aspetto almeno 48h prima di qualsiasi decisione finanziaria"),
    ]

    chk_style = ParagraphStyle(
        "Chk",
        parent=s.body,
        fontSize=10,
        leading=14,
        textColor=t.text,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    cat_style = ParagraphStyle(
        "Cat",
        parent=s.body,
        fontSize=8,
        textColor=t.accent,
        fontName="Helvetica-Bold",
        alignment=TA_LEFT,
    )

    # Raggruppa per categoria così header + voci stanno insieme
    from itertools import groupby
    for cat, group in groupby(checklist_items, key=lambda x: x[0]):
        items_in_cat = list(group)
        block: list = [Paragraph(cat, cat_style), Spacer(1, 0.1 * cm)]
        for _, item in items_in_cat:
            # Uso [ ] ASCII per garantire rendering anche senza font Unicode
            block.append(
                Paragraph(
                    f'<font face="Helvetica-Bold">[  ]</font>  {item}', chk_style
                )
            )
        block.append(Spacer(1, 0.2 * cm))
        story.append(KeepTogether(block))
    story.append(PageBreak())

    # ===========================================================
    # CONCLUSIONE
    # ===========================================================
    story.append(Paragraph("CONCLUSIONE", s.eyebrow))
    story.append(Paragraph("E adesso?", s.h1))
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Se sei arrivato fin qui, hai già fatto qualcosa che la maggioranza "
            "non fa: <b>hai dedicato 20 minuti a leggere di soldi senza che "
            "qualcuno ti vendesse nulla</b>. È un buon segnale.",
            s.lead,
        )
    )
    story.append(Paragraph("Da qui in avanti, le strade sono tre.", s.body))

    story.append(Paragraph("1. Continui da solo", s.h3))
    story.append(
        Paragraph(
            "Libri (Bogle, Malkiel, Kiyosaki, Niro), podcast, video gratuiti. È "
            "possibile, richiede molto tempo e capacità di distinguere informazione "
            "buona da rumore. Per chi è abituato a studiare, è una strada valida.",
            s.body,
        )
    )

    story.append(Paragraph("2. Parli con un consulente finanziario abilitato", s.h3))
    story.append(
        Paragraph(
            "Iscritto all'Albo dei Consulenti Finanziari (OCF). Strada giusta se "
            "vuoi un piano <b>personalizzato</b>. Esistono <b>fee-only</b> (paghi "
            "una parcella, niente conflitti di interesse) e consulenti legati a "
            "reti di vendita (remunerati su prodotti). La differenza è importante.",
            s.body,
        )
    )

    story.append(Paragraph("3. Ti formi con un percorso strutturato", s.h3))
    story.append(
        Paragraph(
            "Percorsi che insegnano a leggere i mercati, capire strumenti, "
            "gestire il rischio. Non sostituiscono la consulenza, ma ti rendono "
            "un cliente o investitore più consapevole. È la strada per chi vuole "
            "capire come funzionano le cose, non solo \"comprare il prodotto giusto\".",
            s.body,
        )
    )

    story.append(Spacer(1, 0.4 * cm))
    story.append(
        callout(
            "<b>Se vuoi sapere di più sul percorso formativo che proponiamo,</b> "
            "puoi prenotare una call gratuita di 30 minuti. Te lo mostriamo dal vivo, "
            "rispondiamo alle tue domande e decidi tu se fa per te. Nessuna pressione, "
            "nessun obbligo.",
            s,
            t,
            color=t.accent,
            bg_alpha=0.12 if t.name == "light" else 0.10,
        )
    )
    story.append(PageBreak())

    # ===========================================================
    # DISCLAIMER FINALE
    # ===========================================================
    story.append(Paragraph("INFORMAZIONI IMPORTANTI", s.eyebrow))
    story.append(Paragraph("Disclaimer legale", s.h2))
    story.append(
        Paragraph(
            "Questa guida ha esclusivamente <b>scopo formativo ed educativo</b>. "
            "Non costituisce consulenza finanziaria personalizzata, consulenza in "
            "materia di investimenti, raccomandazione personalizzata, sollecitazione "
            "al pubblico risparmio né attività riservate ai sensi del Testo Unico "
            "della Finanza (D.Lgs 24 febbraio 1998, n. 58).",
            s.body,
        )
    )
    story.append(
        Paragraph(
            "Investire nei mercati finanziari comporta <b>rischi significativi</b>, "
            "incluso il rischio di perdita totale del capitale. Le performance "
            "passate non garantiscono risultati futuri. Rivolgersi sempre a un "
            "consulente finanziario abilitato CONSOB prima di prendere decisioni "
            "di investimento.",
            s.body,
        )
    )
    story.append(
        Paragraph(
            "Gli esempi numerici contenuti nella guida sono <b>puramente didattici</b> "
            "e non costituiscono previsioni o promesse di rendimento. Il \"Cashflow "
            "Quadrant\" è un concetto divulgato da Robert Kiyosaki, citato qui solo "
            "a fini educativi. Le citazioni di strumenti finanziari specifici "
            "(BTP€i, ETF, conti deposito) sono esempi di categoria, non "
            "raccomandazioni di acquisto di prodotti specifici.",
            s.body,
        )
    )
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Chi siamo", s.h2))
    story.append(
        Paragraph(
            "<b>Spike</b> è il sito di collaboratori indipendenti autorizzati che "
            "distribuiscono un percorso formativo strutturato in educazione "
            "finanziaria, trading e investimenti. Operiamo in conformità con la "
            "Legge 17 agosto 2005, n. 173 sulla vendita diretta. Il nostro programma "
            "collaboratori non remunera il mero reclutamento: i compensi derivano "
            "esclusivamente dalla vendita di prodotti formativi a clienti finali.",
            s.body,
        )
    )
    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Per saperne di più", s.h2))
    story.append(
        Paragraph(
            "Prenota una call gratuita di 30 minuti dal sito.<br/>"
            "Nessuna pressione, nessun obbligo, decidi tu se andare avanti.",
            s.body,
        )
    )

    return story


# ---------------------------------------------------------------------------
# BUILD
# ---------------------------------------------------------------------------
def build_pdf(output_path: Path, theme: Theme) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    styles = make_styles(theme)

    doc = BaseDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2.5 * cm,
        title="I 7 errori finanziari che fanno gli italiani — Spike",
        author="Spike",
        subject="Guida gratuita di educazione finanziaria",
        creator="Spike",
    )
    content_frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height - 0.5 * cm,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    cover_frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    doc.addPageTemplates(
        [
            PageTemplate(id="cover", frames=[cover_frame], onPage=cover_painter(theme)),
            PageTemplate(
                id="content", frames=[content_frame], onPage=background_painter(theme)
            ),
        ]
    )

    story = build_story(theme, styles)
    final_story: list = [NextPageTemplate("content")]
    inserted = False
    for el in story:
        if not inserted and isinstance(el, PageBreak):
            final_story.append(NextPageTemplate("content"))
            final_story.append(el)
            inserted = True
        else:
            final_story.append(el)
    doc.build(final_story)
    print(f"OK [{theme.name}] -> {output_path}")


def main() -> None:
    public_dir = Path(__file__).resolve().parent.parent / "public"
    build_pdf(public_dir / "guida-7-errori-finanziari-dark.pdf", DARK)
    build_pdf(public_dir / "guida-7-errori-finanziari-light.pdf", LIGHT)


if __name__ == "__main__":
    main()
