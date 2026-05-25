import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Spike | Educazione finanziaria seria",
    template: "%s · Spike",
  },
  description:
    "Spike. Un percorso formativo strutturato per comprendere mercati, rischio e gestione del capitale. Niente promesse, solo formazione, strumenti didattici e professionisti.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  applicationName: "Spike",
  appleWebApp: {
    capable: true,
    title: "Spike",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Spike | Educazione finanziaria seria",
    description:
      "Percorso formativo per comprendere mercati, rischio e gestione del capitale. Nessuna garanzia di risultato.",
    type: "website",
    locale: "it_IT",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#05080F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={manrope.variable}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
