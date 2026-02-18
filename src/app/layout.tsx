import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
