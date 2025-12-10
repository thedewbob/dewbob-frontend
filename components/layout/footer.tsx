import { Container } from "./container";
import { getSiteSettings } from "@/lib/directus";
import Image from "next/image";

export async function Footer() {
  const settings = await getSiteSettings('dewbob');

  return (
    <footer className="bg-[#2D2D3F] text-[#FDF8F3] mt-auto py-12">
      <Container>
        {/* Main Footer Content - 3 columns */}
        <div className="grid grid-cols-1 xl:grid-cols-[25%_50%_25%] gap-8 mb-8">
          {/* Uncle Bobby Image + Tagline - 25% */}
          <div className="flex flex-col items-center md:items-start">
            {settings?.footer_image && typeof settings.footer_image === 'string' ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${settings.footer_image}`}
                alt="Uncle Bobby"
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <img
                src="/uncle-bobby-footer.png"
                alt="Uncle Bobby"
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            )}
            <p className="text-sm text-center md:text-left italic text-[#FDF8F3]">
              {settings?.site_tagline || "Smart-ass wisdom, straight from the Gulf of America!"}
            </p>
          </div>

          {/* Quote - 50% */}
          <div className="flex items-center justify-center py-4 lg:py-0">
            <blockquote
              className="text-xl md:text-2xl lg:text-3xl text-center text-[#FDF8F3] leading-tight"
              style={{ fontFamily: "var(--font-architects-daughter)" }}
            >
              {settings?.footer_quote || '"If you took my advice seriously, that\'s on you."'}
            </blockquote>
          </div>

          {/* Search Box - 25% */}
          <div className="flex flex-col justify-center">
            <form action="/search" method="GET" className="relative">
              <input
                type="search"
                name="q"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-[25px] bg-white text-[#1A1A1A] border-[3px] border-[#3D7F78] focus:outline-none focus:ring-2 focus:ring-[#3D7F78]"
                aria-label="Search"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-[#3D7F78] text-[#FDF8F3] rounded-[25px] text-sm hover:bg-[#336B66] transition-colors"
                aria-label="Submit search"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="border-t border-[#FDF8F3]/20 pt-6 text-center">
          <p className="text-sm text-[#FDF8F3] mb-1">
            {settings?.copyright_text || "© 2025 DewBob.com — All rights preserved for mockery and misuse."}
          </p>
        </div>
      </Container>
    </footer>
  );
}
