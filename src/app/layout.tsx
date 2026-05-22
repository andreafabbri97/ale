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
    default: "NOA Italia | Educazione finanziaria seria",
    template: "%s · NOA × One Tribe",
  },
  description:
    "NOA × One Tribe Academy. La piattaforma italiana di educazione finanziaria. Niente promesse, solo formazione, strumenti AI e professionisti.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "NOA Italia | Educazione finanziaria seria",
    description: "Niente soldi facili. Solo educazione finanziaria.",
    type: "website",
    locale: "it_IT",
  },
  robots: {
    index: true,
    follow: true,
  },
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
