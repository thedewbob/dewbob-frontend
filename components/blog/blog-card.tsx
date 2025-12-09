import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/lib/directus";

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const featuredImageId = typeof blog.featured_image === 'string'
    ? blog.featured_image
    : (blog.featured_image as { id?: string })?.id;
  const imageUrl = featuredImageId
    ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${featuredImageId}`
    : null;
  const imageAlt = blog.post_title;

  // Use air_date from script if available, otherwise fall back to created_at
  const dateToUse = blog.scripts_id?.air_date || blog.created_at;
  const publishDate = new Date(dateToUse).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use direct category_id (might be object or ID), fall back to nested path
  let category = (blog as { category_id?: unknown }).category_id;
  if (!category) {
    category = blog.scripts_id?.topics_id?.ub_category_id;
  }

  return (
    <article className={`relative flex flex-col bg-white rounded-[20px] shadow-[8px_12px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:scale-[1.01] animate-fade-in-up ${className || ""}`}>
      {/* Category Badge - Absolute positioned (from element 51258d2) */}
      {category && (
        <div
          className="absolute top-[15px] right-[15px] z-10 px-3 py-1 rounded-[100px]"
          style={{
            backgroundColor: 'hsl(var(--secondary))',
            color: 'hsl(var(--surface))',
            fontFamily: 'var(--font-inter)',
            fontSize: '0.75em',
            fontWeight: '600',
            lineHeight: '1.6em'
          }}
        >
          <span className="uppercase">{category.category_name}</span>
        </div>
      )}

      <Link href={`/ask-uncle-bobby/${blog.slug}`} className="flex flex-col h-full no-underline">
        {/* Featured Image (from element ea11274) */}
        {imageUrl && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-[20px]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Title (from element b2ca85e) - Architects Daughter, 1.25em, 600 weight */}
          <h3
            className="mt-3 mx-[10px] mb-0 no-underline"
            style={{
              fontFamily: 'Architects Daughter, cursive',
              fontSize: '1.25em',
              fontWeight: '600',
              lineHeight: '1.5em',
              letterSpacing: '-0.005em',
              color: 'hsl(var(--accent))'
            }}
          >
            {blog.post_title}
          </h3>

          {/* Excerpt (from element 37423c3) - Inter, 0.85em, #555555 */}
          {blog.excerpt && (
            <p
              className="mt-0 mx-[10px] mb-0 line-clamp-3 no-underline"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85em',
                fontWeight: '400',
                lineHeight: '1.6em',
                color: '#555555'
              }}
            >
              {blog.excerpt}
            </p>
          )}

          {/* Read More (from element 07e7670) - Inter, 0.85em, 700 weight, uppercase */}
          <div className="mt-0 mr-[10px] mb-0 ml-0 text-right">
            <span
              className="no-underline uppercase"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85em',
                fontWeight: '700',
                color: 'hsl(var(--accent))'
              }}
            >
              Read More →
            </span>
          </div>

          {/* Post Info (from element cd7108f) - Inter, 0.85em, 600 weight, border top */}
          <div
            className="pt-1 pr-0 pb-0 pl-0 border-t border-[hsl(var(--muted-foreground))] mt-auto mx-[10px] mb-[10px]"
          >
            <div
              className="flex items-center gap-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.85em',
                fontWeight: '600',
                lineHeight: '1.6em',
                color: 'hsl(var(--muted-foreground))'
              }}
            >
              <time dateTime={blog.created_at}>{publishDate}</time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
