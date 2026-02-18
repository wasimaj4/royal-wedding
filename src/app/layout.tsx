import type { Metadata } from "next";
import {
  Great_Vibes,
  Playfair_Display,
  Cormorant_Garamond,
  Amiri,
  Aref_Ruqaa,
} from "next/font/google";
import "./globals.css";

/* ── Self-hosted Google Fonts (no render-blocking @import) ─ */

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://royal-wedding-nine.vercel.app"),
  title: "Wasim & Rayan — Wedding Invitation",
  description:
    "You are cordially invited to the wedding celebration of Wasim & Rayan on 17 May 2026.",
  openGraph: {
    title: "Wasim & Rayan — Wedding Invitation",
    description:
      "You are cordially invited to the wedding celebration of Wasim & Rayan on 17 May 2026.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    siteName: "Wasim & Rayan Wedding",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Wasim & Rayan Wedding Invitation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wasim & Rayan — Wedding Invitation",
    description:
      "You are cordially invited to the wedding celebration of Wasim & Rayan on 17 May 2026.",
    images: ["/api/og"],
  },
  other: {
    "whatsapp:title": "Wasim & Rayan — Wedding Invitation 💍",
    "whatsapp:description":
      "You are cordially invited to our wedding on 17 May 2026",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#F5E6C8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`antialiased ${greatVibes.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${amiri.variable} ${arefRuqaa.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
