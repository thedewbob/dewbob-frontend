import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/lib/directus";
import { getImageUrl, getImageAlt } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  const featuredImage = blog.images?.[0];
  const imageUrl = getImageUrl(featuredImage);
  const imageAlt = getImageAlt(featuredImage, blog.post_title);

  const publishDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const category = blog.scripts?.topics?.ub_category;

  return (
    <article
      className={cn(
        // Exact Elementor card styling from Template 391
        "group relative flex flex-col",
        "bg-card rounded-[20px]",
        "shadow-[8px_12px_20px_rgba(0,0,0,0.07)]",
        "transition-all duration-300 ease-out",
        "hover:scale-[1.01]",
        "animate-fade-in-up",
        className
      )}
    >
      {/* Category Badge - Absolute positioned */}
      {category && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-secondary text-surface rounded-full shadow-md">
          <span className="text-xs font-semibold uppercase tracking-wide">
            {category.category_name}
          </span>
        </div>
      )}

      <Link href={`/ask-uncle-bobby/${blog.slug}`} className="flex flex-col h-full no-underline">
        {/* Featured Image */}
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

        <div className="flex-1 flex flex-col px-[10px] py-[12px]">
          {/* Title - Architects Daughter, 1.25em */}
          <h3
            className="text-[1.25em] font-semibold leading-[1.5] text-accent group-hover:text-accent-hover transition-colors mb-2 no-underline"
            style={{ fontFamily: "var(--font-architects-daughter)" }}
          >
            {blog.post_title}
          </h3>

          {/* Excerpt - Inter, 0.85em */}
          {blog.excerpt && (
            <p className="text-[0.85em] text-muted-foreground leading-[1.6] line-clamp-3 mb-4 flex-1 no-underline">
              {blog.excerpt}
            </p>
          )}

          {/* Read More + Meta */}
          <div className="mt-auto">
            <div className="flex justify-end mb-3">
              <span
                className="text-[0.85em] font-bold uppercase tracking-wide text-accent group-hover:text-accent-hover transition-colors no-underline"
                style={{ fontFamily: "var(--font-architects-daughter)" }}
              >
                Read More →
              </span>
            </div>

            {/* Post Info - Border top */}
            <div className="pt-3 border-t border-muted-foreground/20">
              <div className="flex items-center gap-4 text-[0.75em] text-muted-foreground no-underline">
                <time dateTime={blog.created_at}>{publishDate}</time>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
