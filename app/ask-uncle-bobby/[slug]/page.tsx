import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeaderWrapper as Header } from "@/components/layout/header-wrapper";
import { getBlogBySlug, getPublishedBlogs, getBlogsByCategory } from "@/lib/directus";
import type { Metadata } from "next";
import type { Blog } from "@/lib/directus";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering - no caching during build
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 60; // ISR: revalidate every 60 seconds at runtime

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Post Not Found",
    };
  }

  const seo = blog.seo?.[0];

  return {
    title: seo?.seo_title || blog.post_title,
    description: seo?.meta_description || blog.excerpt || undefined,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Get featured image
  const featuredImageId = typeof blog.featured_image === 'string'
    ? blog.featured_image
    : (blog.featured_image as { id?: string })?.id;
  const imageUrl = featuredImageId
    ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${featuredImageId}`
    : null;
  const imageAlt = blog.post_title;

  // Debug logging removed - featured image handling working correctly

  // Format date - use air_date from scripts if available, fallback to created_at
  const dateToDisplay = blog.scripts?.air_date || blog.created_at;
  const publishDate = new Date(dateToDisplay).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get category - use direct category_id first, fall back to nested
  let category = (blog as { category_id?: unknown }).category_id;
  if (!category) {
    category = blog.scripts?.topics?.ub_category;
  }

  // Get prev/next posts in same category
  let prevPost: Blog | null = null;
  let nextPost: Blog | null = null;

  if (category) {
    const categoryBlogs = await getBlogsByCategory(category.category_id, 100);
    const currentIndex = categoryBlogs.findIndex((b: Blog) => b.slug === slug);

    if (currentIndex > 0) {
      nextPost = categoryBlogs[currentIndex - 1]; // Newer post
    }
    if (currentIndex < categoryBlogs.length - 1) {
      prevPost = categoryBlogs[currentIndex + 1]; // Older post
    }
  }

  return (
    <>
      <Header />
      <article className="bg-[#FDF8F3] [&_p]:whitespace-normal [&_p]:break-normal [&_p]:break-words [&_div]:whitespace-normal [&_div]:break-normal [&_div]:break-words [&_h1]:whitespace-normal [&_h1]:break-words [&_h2]:whitespace-normal [&_h2]:break-words [&_h3]:whitespace-normal [&_h3]:break-words [&_h4]:whitespace-normal [&_h4]:break-words [&_h5]:whitespace-normal [&_h5]:break-words [&_h6]:whitespace-normal [&_h6]:break-words">
        {/* Hero Section - Secondary Color Background with Featured Image */}
        <section className="bg-[#2D2D3F] py-12">
          <Container className="max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Title and Meta */}
              <div className="text-center md:text-left order-2 md:order-1">
                <h1
                  className="text-[#FDF8F3] text-3xl md:text-4xl lg:text-5xl mb-6"
                  style={{
                    fontFamily: "var(--font-architects-daughter)",
                    fontWeight: "600",
                    lineHeight: "1.5",
                  }}
                >
                  {blog.post_title}
                </h1>

                {/* Post Meta Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-[#FDF8F3] text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#3D7F78]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Uncle Bobby</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#3D7F78]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <time dateTime={dateToDisplay}>{publishDate}</time>
                  </div>
                  {category && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#3D7F78]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      <Link
                        href={`/ask-uncle-bobby/category/${category.category_slug || category.category_id}`}
                        className="text-[#3D7F78] hover:text-[#336B66] no-underline transition-colors"
                      >
                        {category.category_name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Featured Image */}
              <div className="order-1 md:order-2">
                {imageUrl ? (
                  <div className="relative w-full h-[300px] md:h-[400px] rounded-[20px] overflow-hidden shadow-[8px_12px_20px_rgba(0,0,0,0.3)]">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-[300px] md:h-[400px] rounded-[20px] bg-[#3D7F78] flex items-center justify-center">
                    <span className="text-[#FDF8F3] text-lg" style={{ fontFamily: "var(--font-architects-daughter)" }}>
                      No Image
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <Container className="max-w-4xl">
            {/* Post Content */}
            <div className="wysiwyg-content max-w-none mb-10">
              {blog.blog_copy ? (
                <div dangerouslySetInnerHTML={{ __html: blog.blog_copy }} />
              ) : (
                <p className="text-muted-foreground">No content available.</p>
              )}
            </div>

            {/* Post Navigation */}
            {(prevPost || nextPost) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Previous Post */}
                {prevPost ? (
                  <Link
                    href={`/ask-uncle-bobby/${prevPost.slug}`}
                    className="flex flex-col items-center justify-center gap-[10px] bg-white border-[3px] border-[#3D7F78] rounded-[25px] shadow-[8px_12px_20px_rgba(0,0,0,0.15)] p-[10px] hover:scale-105 transition-transform no-underline"
                  >
                    <div className="flex flex-row items-center justify-between gap-[10px] w-full">
                      {(() => {
                        const featuredImageId = typeof prevPost.featured_image === 'string'
                          ? prevPost.featured_image
                          : (prevPost.featured_image as { id?: string })?.id;
                        const imageUrl = featuredImageId
                          ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${featuredImageId}`
                          : null;
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={prevPost.post_title}
                            className="w-16 h-16 object-cover rounded-full"
                          />
                        ) : null;
                      })()}
                      <h3
                        className="text-[1.25em] font-semibold text-[#1A1A1A] flex-1"
                        style={{ fontFamily: "var(--font-architects-daughter)" }}
                      >
                        {prevPost.post_title}
                      </h3>
                    </div>
                    <button
                      className="text-[0.75em] text-center px-4 py-2 bg-[#B8472D] text-white rounded-[25px] hover:bg-[#9C3A25] transition-colors uppercase font-semibold"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      ← Previous
                    </button>
                  </Link>
                ) : (
                  <div></div>
                )}

                {/* Next Post */}
                {nextPost && (
                  <Link
                    href={`/ask-uncle-bobby/${nextPost.slug}`}
                    className="flex flex-col items-center justify-center gap-[10px] bg-white border-[3px] border-[#3D7F78] rounded-[25px] shadow-[8px_12px_20px_rgba(0,0,0,0.15)] p-[10px] hover:scale-105 transition-transform no-underline"
                  >
                    <div className="flex flex-row items-center justify-between gap-[10px] w-full">
                      {(() => {
                        const featuredImageId = typeof nextPost.featured_image === 'string'
                          ? nextPost.featured_image
                          : (nextPost.featured_image as { id?: string })?.id;
                        const imageUrl = featuredImageId
                          ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${featuredImageId}`
                          : null;
                        return imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={nextPost.post_title}
                            className="w-16 h-16 object-cover rounded-full"
                          />
                        ) : null;
                      })()}
                      <h3
                        className="text-[1.25em] font-semibold text-[#1A1A1A] flex-1"
                        style={{ fontFamily: "var(--font-architects-daughter)" }}
                      >
                        {nextPost.post_title}
                      </h3>
                    </div>
                    <button
                      className="text-[0.75em] text-center px-4 py-2 bg-[#B8472D] text-white rounded-[25px] hover:bg-[#9C3A25] transition-colors uppercase font-semibold"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Next →
                    </button>
                  </Link>
                )}
              </div>
            )}

            {/* Back to All Posts */}
            <div className="text-center">
              <Link
                href="/ask-uncle-bobby"
                className="inline-flex items-center gap-2 text-[#3D7F78] hover:text-[#336B66] font-semibold no-underline transition-colors"
                style={{ fontFamily: "var(--font-architects-daughter)" }}
              >
                ← Back to all posts
              </Link>
            </div>
          </Container>
        </section>
      </article>
    </>
  );
}
