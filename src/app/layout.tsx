import type { Metadata } from "next";
import {
  Great_Vibes,
  Playfair_Display,
  Cormorant_Garamond,
  Amiri,
  Aref_Ruqaa,
} from "next/font/google";
import "./globals.css";

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
    "Together with our families, and by the grace of Allah, we are honored to invite you to our wedding celebration — 17 May 2026.",
  openGraph: {
    title: "Wasim & Rayan — Wedding Invitation",
    description:
      "Together with our families, and by the grace of Allah, we are honored to invite you to our wedding — 17 May 2026.",
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
      "You are honored to attend our wedding celebration — 17 May 2026.",
    images: ["/api/og"],
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
        <meta name="theme-color" content="#FDFBF7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
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
