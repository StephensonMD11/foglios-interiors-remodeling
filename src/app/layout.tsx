import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `Bathroom Remodeling & Flooring in South Jersey | ${siteConfig.name}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: siteConfig.name,
    title: `Bathroom Remodeling & Flooring in South Jersey | ${siteConfig.name}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Bathroom Remodeling & Flooring in South Jersey | ${siteConfig.name}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsense = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <head>
        <JsonLd />
        {adsense ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
