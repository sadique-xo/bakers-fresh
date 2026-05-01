import type { Metadata } from "next";
import { Caveat, Fraunces, Inter, Geist } from "next/font/google";

import { AppToaster } from "@/components/providers/app-toaster";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteOutlets } from "@/lib/queries/public-content";

import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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

export const metadata: Metadata = {
  title: {
    default: "baker's fresh | custom cakes ranchi",
    template: "%s | baker's fresh",
  },
  description:
    "handcrafted custom cakes and bakes in ranchi. order online, we call you back within 2 hours.",
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const outlets = await getSiteOutlets();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("h-full", "scroll-smooth", inter.variable, fraunces.variable, caveat.variable, "font-sans", geist.variable)}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex flex-1 flex-col pt-16 pb-24 md:pb-0 md:pt-[4.5rem]">
          {children}
        </main>
        <SiteFooter outlets={outlets} />
        <MobileBottomNav />
        <AppToaster />
      </body>
    </html>
  );
}
