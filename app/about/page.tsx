import { Container } from "@/components/layout/container";
import { HeaderWrapper as Header } from "@/components/layout/header-wrapper";
import { getPageBySlug, getSiteSettings } from "@/lib/directus";
import { notFound } from "next/navigation";
import { AlternatingContentBlocks } from "@/components/page-builder/alternating-content-blocks";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About DewBob | The Legend of the Digital Wizard",
  description: "Discover the legendary story of DewBob - the IT wizard, logistics master, and digital sage who saved the world from Y2K and mastered the internet.",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const page = await getPageBySlug("about", "dewbob");
  const settings = await getSiteSettings("dewbob");

  if (!page || !page.blocks) {
    notFound();
  }

  const logoUrl = settings?.logo
    ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${settings.logo}`
    : null;

  return (
    <>
      <Header />
      <div className="bg-[#FDF8F3] min-h-screen">
        {/* Hero Section - Page Body */}
        {page.body && (
          <section className="bg-[#B8472D] py-12 text-center">
            <Container>
              {logoUrl && (
                <div className="flex justify-center mb-8">
                  <Image
                    src={logoUrl}
                    alt={settings?.site_name || "Logo"}
                    width={120}
                    height={120}
                    className="h-auto"
                  />
                </div>
              )}
              <div
                className="max-w-4xl mx-auto [&_*]:text-white [&_*]:!text-white"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "1em",
                  fontWeight: "400",
                  lineHeight: "1.4",
                  letterSpacing: "0.2px",
                  wordSpacing: "0.5px",
                  color: "white",
                }}
                dangerouslySetInnerHTML={{ __html: page.body }}
              />
            </Container>
          </section>
        )}

        {/* Content Blocks Section */}
        <section className="py-12">
          <Container>
            {/* Page Builder Blocks */}
            {page.blocks.map((block: any) => {
              // Alternating Content Blocks Component
              if (block.collection === "component_alternating_content") {
                return (
                  <AlternatingContentBlocks
                    key={block.id}
                    component={block.item}
                  />
                );
              }

              // Add other component types here as needed
              return null;
            })}
          </Container>
        </section>
      </div>
    </>
  );
}
