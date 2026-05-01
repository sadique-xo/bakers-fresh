import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-jsonld";
import { getSiteOutlets } from "@/lib/queries/public-content";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const outlets = await getSiteOutlets();

  return (
    <>
      <LocalBusinessJsonLd />
      <GoogleAnalytics />
      <SiteHeader />
      <main className="flex flex-1 flex-col pt-16 pb-24 md:pb-0 md:pt-[4.5rem]">
        {children}
      </main>
      <SiteFooter outlets={outlets} />
      <MobileBottomNav />
    </>
  );
}
