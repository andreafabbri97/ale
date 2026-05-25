"""
Genera la guida 'I 7 errori finanziari che fanno gli italiani' come PDF.

Output: public/guida-7-errori-finanziari.pdf

Run: python scripts/build_guide_pdf.py

Design: dark theme allineato alla palette Alead (bg #05080F, accent #3BD4F8).
Stile sobrio, didattico, anti-promesse di guadagno.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from reportlab.lib.colors import HexColor, Color
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfgen.canvas import Canvas

# ---------------------------------------------------------------------------
# Palette (allineata a globals.css del sito)
# ---------------------------------------------------------------------------
BG = HexColor("#05080F")
BG_2 = HexColor("#0A1226")
BG_3 = HexColor("#0F1B3D")
ACCENT = HexColor("#3BD4F8")
ACCENT_2 = HexColor("#2C7BE5")
TEXT = HexColor("#F5F8FF")
TEXT_DIM = HexColor("#A8B3CF")
TEXT_FAINT = HexColor("#5C6789")
BORDER = Color(1, 1, 1, alpha=0.10)
DANGER = HexColor("#E74C3C")
SUCCESS = HexColor("#2ECC71")


# ---------------------------------------------------------------------------
# Stili paragrafi
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

H1 = ParagraphStyle(
    "H1",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=32,
    leading=38,
    textColor=TEXT,
    spaceAfter=14,
    spaceBefore=0,
)

H2 = ParagraphStyle(
    "H2",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=22,
    leading=28,
    textColor=TEXT,
    spaceAfter=12,
    spaceBefore=18,
)

H3 = ParagraphStyle(
    "H3",
    parent=styles["Heading3"],
    fontName="Helvetica-Bold",
    fontSize=14,
    leading=18,
    textColor=ACCENT,
    spaceAfter=8,
    spaceBefore=14,
)

EYEBROW = ParagraphStyle(
    "Eyebrow",
    parent=styles["Normal"],
    fontName="Helvetica-Bold",
    fontSize=8,
    leading=12,
    textColor=ACCENT,
    spaceAfter=6,
)

BODY = ParagraphStyle(
    "Body",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=11,
    leading=17,
    textColor=TEXT_DIM,
    alignment=TA_JUSTIFY,
    spaceAfter=10,
)

LEAD = ParagraphStyle(
    "Lead",
    parent=BODY,
    fontSize=13,
    leading=20,
    textColor=TEXT,
    spaceAfter=14,
)

QUOTE = ParagraphStyle(
    "Quote",
    parent=BODY,
    fontSize=12,
    leading=18,
    leftIndent=18,
    rightIndent=18,
    textColor=TEXT,
    fontName="Helvetica-Oblique",
    spaceBefore=10,
    spaceAfter=14,
)

DISCLAIMER = ParagraphStyle(
    "Disclaimer",
    parent=BODY,
    fontSize=8,
    leading=12,
    textColor=TEXT_FAINT,
    alignment=TA_LEFT,
)

LIST_ITEM = ParagraphStyle(
    "ListItem",
    parent=BODY,
    leftIndent=18,
    bulletIndent=4,
    spaceAfter=4,
)

COVER_TITLE = ParagraphStyle(
    "CoverTitle",
    parent=H1,
    fontSize=40,
    leading=46,
    alignment=TA_CENTER,
    textColor=TEXT,
)

COVER_SUB = ParagraphStyle(
    "CoverSub",
    parent=LEAD,
    alignment=TA_CENTER,
    textColor=TEXT_DIM,
    fontSize=14,
    leading=20,
)


# ---------------------------------------------------------------------------
# Page templates (background + footer)
# ---------------------------------------------------------------------------
def draw_background(canvas: Canvas, doc, with_footer: bool = True):
    canvas.saveState()
    # Background nero pieno
    canvas.setFillColor(BG)
    canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)

    # Bordo accent sottile in alto
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(3)
    canvas.line(0, A4[1] - 4, A4[0], A4[1] - 4)

    if with_footer:
        # Footer: brand + numero pagina
        canvas.setFont("Helvetica", 8)
        canvas.setFillColor(TEXT_FAINT)
        canvas.drawString(2 * cm, 1.2 * cm, "Alead — Educazione finanziaria")
        canvas.drawRightString(
            A4[0] - 2 * cm, 1.2 * cm, f"Pag. {doc.page}"
        )

        # Bordo footer sopra
        canvas.setStrokeColor(BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(2 * cm, 1.8 * cm, A4[0] - 2 * cm, 1.8 * cm)

    canvas.restoreState()


def cover_background(canvas: Canvas, doc):
    canvas.saveState()
    # Nero
    canvas.setFillColor(BG)
    canvas.rect(0, 0, A4[0], A4[1], stroke=0, fill=1)

    # Decorazione: cerchio radiale azzurro sfumato in alto a destra (simulato)
    for r, alpha in [(180, 0.04), (140, 0.06), (100, 0.10), (60, 0.20)]:
        c = Color(ACCENT_2.red, ACCENT_2.green, ACCENT_2.blue, alpha=alpha)
        canvas.setFillColor(c)
        canvas.circle(A4[0] - 60, A4[1] - 80, r, stroke=0, fill=1)

    # Bordo accent in alto
    canvas.setStrokeColor(ACCENT)
    canvas.setLineWidth(3)
    canvas.line(0, A4[1] - 4, A4[0], A4[1] - 4)

    canvas.restoreState()


# ---------------------------------------------------------------------------
# Boxes helper
# ---------------------------------------------------------------------------
def callout_box(text_html: str, color=ACCENT, bg_alpha: float = 0.08) -> Table:
    """Crea un box callout con bordo accent."""
    p = Paragraph(text_html, BODY)
    bg = Color(color.red, color.green, color.blue, alpha=bg_alpha)
    t = Table([[p]], colWidths=[16 * cm])
    t.setStyle(
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
    return t


def big_number(value: str, label: str) -> Table:
    """Numero grande (es. 10,7/20) con label sotto."""
    num_style = ParagraphStyle(
        "BigNum",
        parent=H1,
        fontSize=48,
        leading=52,
        alignment=TA_CENTER,
        textColor=ACCENT,
    )
    lbl_style = ParagraphStyle(
        "BigLbl",
        parent=BODY,
        alignment=TA_CENTER,
        fontSize=9,
        textColor=TEXT_DIM,
        spaceBefore=0,
    )
    p_num = Paragraph(value, num_style)
    p_lbl = Paragraph(label, lbl_style)
    t = Table([[p_num], [p_lbl]], colWidths=[16 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), BG_2),
                ("BOX", (0, 0), (-1, -1), 1, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 20),
                ("RIGHTPADDING", (0, 0), (-1, -1), 20),
                ("TOPPADDING", (0, 0), (-1, -1), 16),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
            ]
        )
    )
    return t


def scenarios_table(rows: list[tuple[str, str, str]]) -> Table:
    """Tabella scenari: tasso | valore finale | etichetta."""
    header_style = ParagraphStyle(
        "TH",
        parent=BODY,
        textColor=ACCENT,
        fontName="Helvetica-Bold",
        fontSize=10,
        alignment=TA_CENTER,
    )
    cell_style = ParagraphStyle(
        "TD",
        parent=BODY,
        textColor=TEXT,
        alignment=TA_CENTER,
        fontSize=12,
        fontName="Helvetica-Bold",
    )
    label_style = ParagraphStyle(
        "TL",
        parent=BODY,
        textColor=TEXT_DIM,
        alignment=TA_CENTER,
        fontSize=8,
    )

    data = [
        [
            Paragraph("RENDIMENTO", header_style),
            Paragraph("VALORE FINALE", header_style),
            Paragraph("SCENARIO", header_style),
        ]
    ]
    for rate, value, label in rows:
        data.append(
            [
                Paragraph(rate, cell_style),
                Paragraph(value, cell_style),
                Paragraph(label, label_style),
            ]
        )

    t = Table(data, colWidths=[5 * cm, 5.5 * cm, 5.5 * cm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BG_3),
                ("BACKGROUND", (0, 1), (-1, -1), BG_2),
                ("BOX", (0, 0), (-1, -1), 1, BORDER),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )
    return t


# ---------------------------------------------------------------------------
# Contenuto della guida
# ---------------------------------------------------------------------------
def build_story() -> list:
    """Costruisce la lista di flowable per la guida."""
    story: list = []

    # =========================================================
    # COVER
    # =========================================================
    story.append(Spacer(1, 5 * cm))
    story.append(Paragraph("ALEAD · GUIDA GRATUITA", EYEBROW))
    story.append(Spacer(1, 0.6 * cm))
    story.append(
        Paragraph(
            "I 7 errori finanziari<br/>"
            '<font color="#3BD4F8">che fanno gli italiani</font>',
            COVER_TITLE,
        )
    )
    story.append(Spacer(1, 0.8 * cm))
    story.append(
        Paragraph(
            "Cosa nessuno ci ha mai insegnato a scuola<br/>"
            "su debiti, risparmi, inflazione e investimenti.",
            COVER_SUB,
        )
    )
    story.append(Spacer(1, 3 * cm))
    story.append(
        Paragraph(
            '<font color="#5C6789">A cura di Alead — Educazione finanziaria, '
            "trading, investimenti</font>",
            ParagraphStyle(
                "CoverFooter",
                parent=BODY,
                alignment=TA_CENTER,
                fontSize=9,
                textColor=TEXT_FAINT,
            ),
        )
    )
    story.append(PageBreak())

    # =========================================================
    # PREFAZIONE
    # =========================================================
    story.append(Paragraph("PREFAZIONE", EYEBROW))
    story.append(Paragraph("Prima di tutto, le aspettative giuste", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "Questa guida non ti farà diventare ricco. Non ti svela un metodo segreto, "
            "non ti promette guadagni veloci, non ti dice quali azioni comprare. "
            "Non è consulenza finanziaria personalizzata.",
            LEAD,
        )
    )
    story.append(
        Paragraph(
            "Quello che fa è molto più semplice: ti aiuta a riconoscere i <b>7 errori</b> "
            "più comuni che gli italiani commettono nella gestione del denaro. "
            "Errori spesso invisibili, ripetuti per anni, che costano migliaia di euro "
            "in potere d'acquisto perso e occasioni mancate.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "L'obiettivo è semplice: <b>riconoscere il problema</b>. Una volta che lo vedi, "
            "puoi decidere se vuoi imparare di più, formarti, parlarne con un professionista "
            "o lasciar perdere. La decisione resta sempre tua.",
            BODY,
        )
    )
    story.append(Spacer(1, 0.5 * cm))
    story.append(
        callout_box(
            "<b>Prima si studia, poi si decide.</b><br/>"
            "Investire comporta sempre rischi, anche di perdita totale del capitale. "
            "Le performance passate non garantiscono risultati futuri.",
            color=ACCENT,
            bg_alpha=0.08,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 1 — Debiti buoni vs cattivi
    # =========================================================
    story.append(Paragraph("ERRORE 1 di 7", EYEBROW))
    story.append(Paragraph('Confondere "debito buono" e "debito cattivo"', H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "Quando senti la parola \"debito\", il riflesso è negativo. "
            "In realtà, non tutti i debiti sono uguali. La distinzione che fa la "
            "differenza è semplice:",
            LEAD,
        )
    )

    story.append(Paragraph("Debiti cattivi", H3))
    story.append(
        Paragraph(
            "Sono quelli che ti fanno spendere oggi soldi che non hai per cose "
            "che <b>perdono valore</b> nel tempo. L'auto nuova in 7 anni, lo smartphone a rate, "
            "la vacanza pagata con la carta revolving, l'elettrodomestico finanziato senza "
            "necessità. Pagano interessi, riducono la tua liquidità futura, e l'oggetto "
            "comprato vale ogni mese meno.",
            BODY,
        )
    )

    story.append(Paragraph("Debiti buoni", H3))
    story.append(
        Paragraph(
            "Sono quelli che ti permettono di acquistare o costruire qualcosa che, "
            "potenzialmente, <b>genera valore</b> o lo mantiene nel tempo. Il mutuo prima casa "
            "(se sostenibile), un prestito d'investimento in formazione professionale "
            "(quando ha un ritorno chiaro), un finanziamento per un'attività con un business "
            "plan solido. Non sono garanzia di guadagno, ma sono strumenti.",
            BODY,
        )
    )

    story.append(Spacer(1, 0.3 * cm))
    story.append(
        callout_box(
            "<b>Dati Banca d'Italia:</b> oltre la metà del debito delle famiglie italiane "
            "è classificato come \"debito al consumo\" (rateizzazioni, prestiti personali, "
            "carte revolving). È il segnale di una società che usa il credito per spendere, "
            "non per costruire.",
            color=ACCENT_2,
            bg_alpha=0.06,
        )
    )
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "<b>La domanda da farti prima di ogni prestito o rata:</b> questo debito mi "
            "permette di costruire qualcosa che vale di più, o di consumare qualcosa che "
            "vale di meno?",
            BODY,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 2 — Risparmi fermi sul conto
    # =========================================================
    story.append(Paragraph("ERRORE 2 di 7", EYEBROW))
    story.append(Paragraph("Lasciare i risparmi fermi sul conto", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "L'inflazione è la tassa silenziosa più costosa che esiste. Non la senti, "
            "non la vedi in busta paga, ma erode il tuo potere d'acquisto ogni anno.",
            LEAD,
        )
    )

    story.append(
        Paragraph(
            "Negli ultimi anni in Italia abbiamo visto inflazione tra il 2% e l'8% annuo "
            "su base media, con picchi su categorie come energia (+34%), beni alimentari "
            "(+24%), trasporti. Tradotto: <b>10.000 € fermi sul conto corrente nel 2020 "
            "valgono in termini reali circa 8.500-9.000 € oggi.</b> Non li hai persi nominalmente, "
            "ma comprano meno cose.",
            BODY,
        )
    )

    story.append(Paragraph("Cosa NON significa", H3))
    story.append(
        Paragraph(
            "<b>Non significa</b> che devi investire tutti i tuoi risparmi in borsa "
            "domani mattina. Una parte di liquidità è sana e necessaria (fondo emergenza, "
            "spese previste). Significa che il \"conto corrente come deposito di valore\" "
            "è un'illusione: il valore si perde, anche se i numeri restano gli stessi.",
            BODY,
        )
    )

    story.append(Paragraph("Cosa significa", H3))
    story.append(
        Paragraph(
            "Significa che ha senso conoscere — anche solo concettualmente — strumenti "
            "che <b>almeno proteggono</b> dal tasso di inflazione: titoli di Stato indicizzati, "
            "obbligazioni, ETF azionari di mercato, conti deposito vincolati, beni rifugio. "
            "Non tutto è adatto a tutti. Ma sapere che esistono è il primo passo.",
            BODY,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 3 — Interesse composto sottovalutato
    # =========================================================
    story.append(Paragraph("ERRORE 3 di 7", EYEBROW))
    story.append(Paragraph("Sottovalutare l'interesse composto", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "Einstein lo definì la \"ottava meraviglia del mondo\". Non perché sia magia, "
            "ma perché la maggior parte delle persone <b>non lo sente</b> finché non lo vede "
            "in numeri concreti, su un orizzonte di lungo periodo.",
            LEAD,
        )
    )
    story.append(
        Paragraph(
            "Esempio puramente didattico: 50 € al mese, versati per 30 anni. Totale "
            "versato: <b>18.000 €</b>. Vediamo come cambia il capitale finale in funzione "
            "del rendimento medio annuo composto:",
            BODY,
        )
    )
    story.append(Spacer(1, 0.4 * cm))

    story.append(
        scenarios_table(
            [
                ("3% / anno", "€ 29.137", "Scenario prudente"),
                ("5% / anno", "€ 41.612", "Scenario moderato"),
                ("7% / anno", "€ 60.900", "Scenario crescita"),
            ]
        )
    )

    story.append(Spacer(1, 0.4 * cm))
    story.append(
        Paragraph(
            "La parte più potente non è il numero finale, ma il <b>tempo</b>. Lo stesso "
            "esercizio fatto per 10 anni invece di 30 dà risultati molto più piccoli. "
            "Iniziare presto è quasi sempre più importante di scegliere lo strumento "
            "\"perfetto\".",
            BODY,
        )
    )
    story.append(
        callout_box(
            "<b>Disclaimer matematico:</b> questi sono esempi didattici. Il rendimento "
            "reale dipende da costi, fiscalità, inflazione, periodo di mercato e rischio "
            "assunto. Il rendimento medio dell'S&amp;P 500 negli ultimi decenni è stato "
            "intorno al 7-9% lordo annuo, ma con periodi anche fortemente negativi. "
            "Le performance passate non garantiscono risultati futuri.",
            color=DANGER,
            bg_alpha=0.08,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 4 — Quadrante del Cashflow
    # =========================================================
    story.append(Paragraph("ERRORE 4 di 7", EYEBROW))
    story.append(Paragraph("Vivere solo in un quadrante", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "Robert Kiyosaki ha divulgato il <i>Cashflow Quadrant</i>, un modo "
            "semplice di vedere da dove arrivano i soldi delle persone. Non è una legge "
            "scientifica, è una mappa. Ma rende molto chiaro un concetto.",
            LEAD,
        )
    )

    # Tabella 2x2 del quadrante
    cell_h_style = ParagraphStyle(
        "QCellH",
        parent=BODY,
        fontName="Helvetica-Bold",
        fontSize=12,
        textColor=TEXT,
        alignment=TA_CENTER,
        spaceAfter=2,
    )
    cell_s_style = ParagraphStyle(
        "QCellS",
        parent=BODY,
        fontSize=9,
        textColor=TEXT_DIM,
        alignment=TA_CENTER,
    )
    cell_p_style = ParagraphStyle(
        "QCellP",
        parent=BODY,
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=ACCENT,
        alignment=TA_CENTER,
    )

    def quad_cell(name, pct, desc):
        return [
            Paragraph(pct, cell_p_style),
            Paragraph(name.upper(), cell_h_style),
            Paragraph(desc, cell_s_style),
        ]

    q1 = quad_cell("Dipendente", "~60%", "Scambia tempo per uno stipendio fisso")
    q2 = quad_cell("Imprenditore", "~4%", "Possiede sistemi che lavorano per lui")
    q3 = quad_cell("Autonomo", "~35%", "Possiede un lavoro, non un'azienda")
    q4 = quad_cell("Investitore", "~1%", "Mette il capitale a generare reddito")

    cell1 = Table([q1], colWidths=[8 * cm])
    cell2 = Table([q2], colWidths=[8 * cm])
    cell3 = Table([q3], colWidths=[8 * cm])
    cell4 = Table([q4], colWidths=[8 * cm])
    for c in (cell1, cell2, cell3, cell4):
        c.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, -1), BG_2),
                    ("BOX", (0, 0), (-1, -1), 1, BORDER),
                    ("LEFTPADDING", (0, 0), (-1, -1), 10),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                    ("TOPPADDING", (0, 0), (-1, -1), 12),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ]
            )
        )

    quad = Table([[cell1, cell2], [cell3, cell4]], colWidths=[8.2 * cm, 8.2 * cm])
    quad.setStyle(
        TableStyle(
            [("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]
        )
    )
    story.append(quad)
    story.append(Spacer(1, 0.5 * cm))

    story.append(
        Paragraph(
            "Le percentuali sono indicative — non sono numeri ufficiali ISTAT — ma il "
            "concetto regge: la stragrande maggioranza delle persone passa la propria vita "
            "scambiando ore di tempo per soldi. Quando smetti di lavorare, smettono i soldi.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "<b>Non c'è niente di sbagliato</b> nell'essere un dipendente o un autonomo. "
            "La trappola non è il quadrante in sé, è <b>conoscerne solo uno</b>. "
            "Capire come funzionano anche gli altri — anche solo come consumatore consapevole "
            "di prodotti finanziari — cambia la prospettiva sulla gestione del denaro.",
            BODY,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 5 — Fondo emergenza mancante
    # =========================================================
    story.append(Paragraph("ERRORE 5 di 7", EYEBROW))
    story.append(Paragraph("Investire senza un fondo emergenza", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "È un classico: leggi di crypto, di azioni, di ETF, ti convinci che è arrivato "
            "il momento di \"far fruttare i risparmi\", e investi tutto il poco che hai. "
            "Poi succede l'imprevisto: la lavatrice, l'auto, una visita medica, un mese "
            "senza lavoro. E devi disinvestire al momento peggiore, magari in perdita.",
            LEAD,
        )
    )

    story.append(Paragraph("La regola dei 3-6 mesi", H3))
    story.append(
        Paragraph(
            "Prima ancora di iniziare a investire, costruisci un <b>fondo emergenza</b> "
            "pari a 3-6 mesi delle tue spese essenziali (affitto/mutuo, bollette, cibo, "
            "trasporti). Conservato in uno strumento liquido e a basso rischio: conto "
            "corrente dedicato, conto deposito non vincolato, libretto postale.",
            BODY,
        )
    )

    story.append(
        Paragraph(
            "Non è una somma che \"rende\". È una somma che ti permette di <b>non disinvestire</b> "
            "i tuoi investimenti reali quando arriva l'imprevisto. È la cintura di sicurezza "
            "che ti permette di guidare più tranquillo.",
            BODY,
        )
    )
    story.append(
        callout_box(
            "<b>Esempio pratico:</b> se le tue spese mensili minime sono 1.500 €, il tuo "
            "fondo emergenza dovrebbe essere tra <b>4.500 € e 9.000 €</b>. Costruirlo richiede "
            "tempo, ed è ok costruirlo prima ancora di iniziare a investire.",
            color=SUCCESS,
            bg_alpha=0.06,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 6 — Imitare i guru
    # =========================================================
    story.append(Paragraph("ERRORE 6 di 7", EYEBROW))
    story.append(Paragraph("Imitare i \"guru\" senza formazione", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "Su Instagram, TikTok, YouTube ci sono migliaia di profili che vendono il "
            "sogno: \"trade da copiare\", \"segnali vincenti\", \"crypto che esploderanno\", "
            "\"strategie da 10K al mese\". La maggior parte sono persone che guadagnano "
            "vendendoti il sogno, non investendo davvero.",
            LEAD,
        )
    )

    story.append(Paragraph("Tre red flag da riconoscere", H3))
    story.append(
        Paragraph(
            "&bull; <b>Promesse di guadagno specifiche</b>: \"x% al mese garantito\", "
            "\"in 6 mesi raddoppi\", \"non si è mai sbagliato\". Chi è davvero capace "
            "non promette risultati certi: <i>li relativizza</i>.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "&bull; <b>Stile di vita esibito</b>: macchine, orologi, hotel di lusso usati "
            "come prova di competenza. La competenza si misura con i risultati di portafoglio "
            "<b>verificabili nel tempo</b>, non con foto da influencer.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "&bull; <b>Pressione all'azione veloce</b>: \"posti limitati\", \"offerta che "
            "scade\", \"agisci ora o perdi il treno\". Le decisioni finanziarie buone "
            "raramente hanno bisogno di urgenza.",
            BODY,
        )
    )

    story.append(Paragraph("L'alternativa concreta", H3))
    story.append(
        Paragraph(
            "Invece di cercare scorciatoie, costruisci un <b>metodo</b>: studia i mercati, "
            "capisci il rischio, prova in piccolo con denaro che puoi permetterti di perdere, "
            "fai tesoro degli errori. Una formazione strutturata — pubblica, costosa o "
            "gratuita che sia — è quasi sempre più utile di mille \"trade da copiare\".",
            BODY,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # ERRORE 7 — Concentrazione del rischio
    # =========================================================
    story.append(Paragraph("ERRORE 7 di 7", EYEBROW))
    story.append(Paragraph("Mettere tutte le uova nello stesso paniere", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "È la regola di buon senso più antica della finanza, ed è anche la più "
            "violata. Quando ci appassioniamo a un'idea — un'azienda, una crypto, un "
            "settore — la tentazione di concentrarci lì è fortissima. \"Se ci credo, "
            "ci metto tutto.\" Risultato: quando va male, va male su tutto.",
            LEAD,
        )
    )

    story.append(Paragraph("Diversificazione, in concreto", H3))
    story.append(
        Paragraph(
            "Non è un termine tecnico complicato. Significa distribuire il rischio su "
            "<b>più asset diversi</b> che reagiscono in modi diversi alle stesse condizioni "
            "di mercato. Azioni, obbligazioni, materie prime, immobili, liquidità, eventualmente "
            "una piccola quota in asset alternativi. Tipicamente per area geografica e per "
            "settore industriale.",
            BODY,
        )
    )

    story.append(Paragraph("Concentrazione \"nascosta\"", H3))
    story.append(
        Paragraph(
            "Attenzione alla concentrazione che <b>non vedi</b>: se la tua casa è la tua "
            "ricchezza principale, sei concentrato sull'immobiliare. Se il tuo TFR è "
            "investito in azioni della tua azienda, sei concentrato due volte (lavoro + "
            "investimento). Se i tuoi risparmi sono solo in BTP italiani, sei concentrato "
            "sul rischio sovrano italiano. Tutto plausibile, ma <b>è bene esserne consapevoli</b>.",
            BODY,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # CONCLUSIONE
    # =========================================================
    story.append(Paragraph("CONCLUSIONE", EYEBROW))
    story.append(Paragraph("E adesso?", H1))
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        Paragraph(
            "Se sei arrivato fin qui, hai già fatto la prima cosa che la maggior parte "
            "delle persone non fa: <b>hai dedicato 20 minuti a leggere di soldi senza che "
            "qualcuno ti vendesse nulla</b>. È un buon segnale.",
            LEAD,
        )
    )

    story.append(
        Paragraph(
            "Da qui in avanti, le strade sono tre.",
            BODY,
        )
    )

    story.append(Paragraph("1. Continui da solo", H3))
    story.append(
        Paragraph(
            "Cerchi libri, podcast, video gratuiti, costruisci da te il tuo percorso. "
            "È possibile, richiede molto tempo e tanta capacità di distinguere informazione "
            "buona da rumore. Per chi è già abituato a studiare, è una strada valida.",
            BODY,
        )
    )

    story.append(Paragraph("2. Parli con un consulente finanziario abilitato", H3))
    story.append(
        Paragraph(
            "Iscritto all'Albo dei Consulenti Finanziari (OCF). È la strada giusta se "
            "vuoi un piano <b>personalizzato</b> sul tuo profilo. Ci sono consulenti "
            "fee-only (paghi una parcella) e consulenti legati a reti di vendita "
            "(remunerati su prodotti). Sapere la differenza è importante.",
            BODY,
        )
    )

    story.append(Paragraph("3. Ti formi con un percorso strutturato", H3))
    story.append(
        Paragraph(
            "Esistono percorsi formativi che ti insegnano a leggere i mercati, "
            "comprendere strumenti, gestire il rischio. Non sostituiscono la consulenza, "
            "ma ti rendono un cliente o investitore più consapevole. È la strada per "
            "chi vuole capire come funzionano le cose, non solo \"comprare il prodotto giusto\".",
            BODY,
        )
    )

    story.append(Spacer(1, 0.4 * cm))
    story.append(
        callout_box(
            "<b>Se vuoi sapere di più sul percorso formativo che proponiamo,</b> "
            "puoi prenotare una call gratuita di 30 minuti. Te lo mostriamo dal vivo, "
            "rispondiamo alle tue domande e decidi tu se fa per te. Nessuna pressione, "
            "nessun obbligo.",
            color=ACCENT,
            bg_alpha=0.10,
        )
    )
    story.append(PageBreak())

    # =========================================================
    # DISCLAIMER + CONTATTI
    # =========================================================
    story.append(Paragraph("INFORMAZIONI IMPORTANTI", EYEBROW))
    story.append(Paragraph("Disclaimer legale", H2))

    story.append(
        Paragraph(
            "Questa guida ha esclusivamente <b>scopo formativo ed educativo</b>. "
            "Non costituisce consulenza finanziaria personalizzata, consulenza in "
            "materia di investimenti, raccomandazione personalizzata, sollecitazione "
            "al pubblico risparmio né attività riservate ai sensi del Testo Unico "
            "della Finanza (D.Lgs 24 febbraio 1998, n. 58).",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "Investire nei mercati finanziari comporta <b>rischi significativi</b>, "
            "incluso il rischio di perdita totale del capitale. Le performance passate "
            "non garantiscono risultati futuri. Rivolgersi sempre a un consulente "
            "finanziario abilitato CONSOB prima di prendere decisioni di investimento.",
            BODY,
        )
    )
    story.append(
        Paragraph(
            "Gli esempi numerici contenuti nella guida sono <b>puramente didattici</b> "
            "e non costituiscono previsioni o promesse di rendimento. Il \"Cashflow "
            "Quadrant\" è un concetto divulgato da Robert Kiyosaki, citato qui solo a "
            "fini educativi.",
            BODY,
        )
    )

    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Chi siamo", H2))
    story.append(
        Paragraph(
            "<b>Alead</b> è il sito di collaboratori indipendenti autorizzati che "
            "distribuiscono un percorso formativo strutturato in educazione finanziaria, "
            "trading e investimenti. Operiamo in conformità con la Legge 17 agosto 2005, "
            "n. 173 sulla vendita diretta. Il nostro programma collaboratori non "
            "remunera il mero reclutamento: i compensi derivano esclusivamente dalla "
            "vendita di prodotti formativi a clienti finali.",
            BODY,
        )
    )

    story.append(Spacer(1, 0.5 * cm))
    story.append(Paragraph("Per saperne di più", H2))
    story.append(
        Paragraph(
            "Sito: <b>alead</b> (link condiviso nel form di contatto)<br/>"
            "Prenota una call gratuita di 30 minuti dal sito.",
            BODY,
        )
    )

    return story


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
def build(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    doc = BaseDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2.5 * cm,
        title="I 7 errori finanziari che fanno gli italiani — Alead",
        author="Alead",
        subject="Guida gratuita di educazione finanziaria",
        creator="Alead",
    )

    # Frame standard per pagine interne (con footer)
    content_frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height - 0.5 * cm,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    # Frame per la cover (più alto, senza footer numerico)
    cover_frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )

    cover_template = PageTemplate(
        id="cover", frames=[cover_frame], onPage=cover_background
    )
    content_template = PageTemplate(
        id="content", frames=[content_frame], onPage=draw_background
    )

    doc.addPageTemplates([cover_template, content_template])

    # Forza il cambio template dopo la cover
    story = build_story()
    # Inserisce un NextPageTemplate prima del primo PageBreak
    from reportlab.platypus import NextPageTemplate

    final_story = [NextPageTemplate("content")]
    # Sostituisci il primo elemento PageBreak con NextPageTemplate + PageBreak
    inserted = False
    for el in story:
        if not inserted and isinstance(el, PageBreak):
            final_story.append(NextPageTemplate("content"))
            final_story.append(el)
            inserted = True
        else:
            final_story.append(el)

    doc.build(final_story)
    print(f"OK -> {output_path}")


if __name__ == "__main__":
    output = Path(__file__).resolve().parent.parent / "public" / "guida-7-errori-finanziari.pdf"
    build(output)
