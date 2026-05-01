import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Inter, Geist } from "next/font/google";

import { AppToaster } from "@/components/providers/app-toaster";
import {
  defaultKeywords,
  defaultOgImageUrl,
  getSiteUrl,
  siteName,
} from "@/lib/seo";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-caveat",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "baker's fresh | custom cakes ranchi",
    template: "%s | baker's fresh",
  },
  description:
    "handcrafted custom cakes and bakes in ranchi. order online, we call you back within 2 hours.",
  applicationName: siteName,
  keywords: defaultKeywords,
  authors: [{ name: siteName, url: getSiteUrl() }],
  creator: siteName,
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName,
    images: [
      {
        url: defaultOgImageUrl,
        width: 1200,
        height: 630,
        alt: "custom celebration cake — baker's fresh ranchi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "scroll-smooth",
        inter.variable,
        fraunces.variable,
        caveat.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="flex min-h-full flex-col font-sans antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
