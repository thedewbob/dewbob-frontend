import { Container } from "@/components/layout/container";
import { getPageBySlug, getPublishedBlogs } from "@/lib/directus";
import { notFound } from "next/navigation";
import { SliderCard } from "@/components/blog/slider-card";
import Image from "next/image";
import { HeroCarousel } from "@/components/hero-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function Home() {
  const page = await getPageBySlug("home", "dewbob");

  if (!page || !page.blocks) {
    notFound();
  }

  return (
    <>
      {page.blocks.map((block: any) => {
        // Hero Component
        if (block.collection === "component_hero") {
          const hero = block.item;
          const carouselImages = hero.carousel_images?.map((img: any) => ({
            id: img.directus_files_id?.id,
            caption: img.directus_files_id?.caption,
            alt: img.directus_files_id?.alternative_text
          })).filter((img: any) => img.id) || [];

          return (
            <section
              key={block.id}
              className="bg-[#B8472D] min-h-[90vh] flex flex-col py-20 relative"
            >
              {/* In-Hero Navigation - Home page only */}
              <div className="absolute top-0 left-0 right-0 pt-4">
                <Container>
                  <nav className="flex items-start justify-start gap-6">
                    <a
                      href="/"
                      className="text-[#FDF8F3] hover:text-white transition-colors text-[1.2em]"
                      style={{ fontFamily: "var(--font-architects-daughter)" }}
                    >
                      Home
                    </a>
                    <a
                      href="/shop"
                      className="text-[#FDF8F3] hover:text-white transition-colors text-[1.2em]"
                      style={{ fontFamily: "var(--font-architects-daughter)" }}
                    >
                      Shop
                    </a>
                    <a
                      href="/ask-uncle-bobby"
                      className="text-[#FDF8F3] hover:text-white transition-colors text-[1.2em]"
                      style={{ fontFamily: "var(--font-architects-daughter)" }}
                    >
                      Ask Uncle Bobby
                    </a>
                    <a
                      href="/the-origin-story"
                      className="text-[#FDF8F3] hover:text-white transition-colors text-[1.2em]"
                      style={{ fontFamily: "var(--font-architects-daughter)" }}
                    >
                      The Origin Story
                    </a>
                    <a
                      href="/privacy-policy"
                      className="text-[#FDF8F3] hover:text-white transition-colors text-[1.2em]"
                      style={{ fontFamily: "var(--font-architects-daughter)" }}
                    >
                      Privacy Policy
                    </a>
                  </nav>
                </Container>
              </div>

              {/* Content centered vertically */}
              <div className="flex-1 flex flex-col justify-center">
                <Container>
                  <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-12 items-center">
                    {/* Left 60%: Headings, Buttons, Search */}
                    <div className="flex flex-col gap-[1em] items-center text-center">
                      {hero.heading_1 && (
                        <h1
                          className="text-[2.25em] md:text-[2.25em] font-bold text-[#FDF8F3] uppercase m-0"
                          style={{ fontFamily: "var(--font-architects-daughter)" }}
                        >
                          {hero.heading_1}
                        </h1>
                      )}
                      {hero.heading_2 && (
                        <h2
                          className="text-[2em] md:text-[2em] font-bold text-[#FDF8F3] m-0"
                          style={{ fontFamily: "var(--font-architects-daughter)" }}
                        >
                          {hero.heading_2}
                        </h2>
                      )}
                      {hero.sub_heading && (
                        <h3
                          className="text-[1.5em] md:text-[1.5em] text-[#FDF8F3] m-0"
                          style={{ fontFamily: "var(--font-architects-daughter)" }}
                        >
                          {hero.sub_heading}
                        </h3>
                      )}

                      {/* Buttons Container */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                        {hero.button_1_text && hero.button_1_url && (
                          <a
                            href={hero.button_1_url}
                            className="px-6 py-3 text-[1em] bg-[#2D2D3F] hover:bg-[#134608d] rounded-[25px] shadow-[8px_12px_20px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform text-white inline-block text-center uppercase font-semibold no-underline"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {hero.button_1_text}
                          </a>
                        )}
                        {hero.button_2_text && hero.button_2_url && (
                          <a
                            href={hero.button_2_url}
                            className="px-6 py-3 text-[1em] bg-[#3D7F78] hover:bg-[#718b778] rounded-[25px] shadow-[8px_12px_20px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform text-white inline-block text-center uppercase font-semibold no-underline"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {hero.button_2_text}
                          </a>
                        )}
                      </div>

                      {/* Search Widget */}
                      {hero.show_search && (
                        <div className="w-full max-w-md mt-8">
                          <form className="relative">
                            <input
                              type="search"
                              placeholder={hero.search_placeholder || "Type to start searching..."}
                              className="w-full px-4 py-2 rounded-[50px] bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-white"
                              aria-label="Search"
                            />
                            <button
                              type="submit"
                              className="absolute right-[5px] top-1/2 -translate-y-1/2 px-4 py-1 bg-[#3D7F78] text-white rounded-[50px] text-sm hover:bg-[#336B66] transition-colors"
                              aria-label="Submit search"
                            >
                              Search
                            </button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Right 40%: Image Carousel */}
                    {carouselImages.length > 0 && (
                      <HeroCarousel images={carouselImages} />
                    )}
                  </div>
                </Container>
              </div>

              {/* Wave Divider at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[3em] overflow-hidden transform scale-y-[-1] scale-x-[-1]">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
                  <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#FDF8F3"></path>
                  <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#FDF8F3"></path>
                  <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#FDF8F3"></path>
                </svg>
              </div>
            </section>
          );
        }

        // Post Rotator Component
        if (block.collection === "component_post_rotator") {
          const rotator = block.item;

          return (
            <PostRotatorSection
              key={block.id}
              heading={rotator.heading}
              postCount={rotator.post_count}
              filterFeatured={rotator.filter_featured}
              categoryFilter={rotator.category_filter}
            />
          );
        }

        // Category Grid Component
        if (block.collection === "component_category_grid") {
          const grid = block.item;
          const categories = grid.categories?.map((cat: any) =>
            cat.ub_categories_category_id
          ) || [];

          return (
            <section key={block.id} className="py-[2em] bg-[#FDF8F3]">
              <Container>
                {grid.heading && (
                  <>
                    <h2
                      className="text-[2em] font-bold text-foreground mt-[2em] mb-[0]"
                      style={{ fontFamily: "var(--font-architects-daughter)" }}
                    >
                      {grid.heading}
                    </h2>
                    <hr className="my-[0] mb-[1.5em] border-t border-border" />
                  </>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[1em]">
                  {categories.map((category: any) => (
                    <a
                      key={category.category_id}
                      href={`/ub_category/${category.category_slug || category.category_id}/`}
                      className="flex flex-col bg-white border-2 border-[#2D2D3F] rounded-[25px] hover:shadow-lg transition-all no-underline"
                    >
                      {category.image && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${category.image}`}
                          alt={category.category_name}
                          width={400}
                          height={300}
                          className="w-full rounded-t-[25px] object-cover"
                        />
                      )}
                      <div className="p-4 flex flex-col gap-2">
                        <h3
                          className="text-[1.5em] text-center text-[#1A1A1A]"
                          style={{ fontFamily: "var(--font-architects-daughter)" }}
                        >
                          {category.category_name}
                        </h3>
                        {category.description && (
                          <p className="text-center text-[#1A1A1A] text-sm">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </Container>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}

// Separate component for post rotator to handle async data fetching
async function PostRotatorSection({
  heading,
  postCount,
  filterFeatured,
  categoryFilter,
}: {
  heading: string | null;
  postCount: number;
  filterFeatured: boolean;
  categoryFilter: number | null;
}) {
  // Fetch blogs based on settings
  const blogs = await getPublishedBlogs(postCount);

  // Filter by featured if needed - fallback to all if no featured exist
  const featuredBlogs = blogs.filter((blog: any) => blog.featured === true);
  const filteredBlogs = filterFeatured && featuredBlogs.length > 0
    ? featuredBlogs
    : blogs;

  // Debug output
  const fs = require('fs');
  fs.writeFileSync('/tmp/blogs-debug.json', JSON.stringify({ blogs, filteredBlogs }, null, 2));

  return (
    <section className="py-[2em] bg-[#FDF8F3]">
      <Container>
        {heading && (
          <>
            <h2
              className="text-[2em] font-bold text-foreground mt-[2em] mb-[0]"
              style={{ fontFamily: "var(--font-architects-daughter)" }}
            >
              {heading}
            </h2>
            <hr className="my-[0] mb-[1.5em] border-t border-border" />
          </>
        )}

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {filteredBlogs.map((blog: any) => (
              <CarouselItem key={blog.blogs_id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <SliderCard blog={blog} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-[#3D7F78] text-[#3D7F78] hover:bg-[#3D7F78] hover:text-white" />
          <CarouselNext className="border-[#3D7F78] text-[#3D7F78] hover:bg-[#3D7F78] hover:text-white" />
        </Carousel>
      </Container>
    </section>
  );
}

// Add metadata for SEO
export const metadata = {
  title: "Ask Uncle Bobby - The worst advice you'll ever love",
  description: "Straight talk, no sugarcoating. Uncle Bobby's got your back with advice that actually works.",
};
