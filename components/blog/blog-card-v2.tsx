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
  // Get the first image if available
  const featuredImage = blog.images?.[0];
  const imageUrl = getImageUrl(featuredImage);
  const imageAlt = getImageAlt(featuredImage, blog.post_title);

  // Format date
  const publishDate = new Date(blog.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get category from topics if available
  const category = blog.scripts?.topics?.ub_category;

  return (
    <article
      className={cn(
        // Exact from Elementor Template 391
        "relative bg-card rounded-[20px] overflow-visible", // Changed to visible for absolute badge
        "shadow-[8px_12px_20px_rgba(0,0,0,0.07)]", // Exact shadow from Elementor
        "hover:scale-[1.01] transition-transform duration-300", // Hover effect
        "animate-fadeInUp", // Elementor animation
        "flex flex-col",
        className
      )}
    >
      <Link href={`/ask-uncle-bobby/${blog.slug}`} className="flex flex-col h-full">
        {/* Featured Image - with blob mask per Elementor */}
        {imageUrl && (
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover shadow-[8px_0_10px_rgba(0,0,0,0.5)]" // Image shadow from Elementor
              style={{
                maskImage: 'radial-gradient(ellipse 80% 100% at 50% 50%, black 40%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 50%, black 40%, transparent 70%)'
              }}
            />
          </div>
        )}

        {/* Category Badge - Absolute positioned top-right per Elementor */}
        {category && (
          <div className="absolute top-[15px] right-[15px] z-10 px-3 py-1 bg-secondary text-surface rounded-full">
            <h6 className="font-inter text-[0.75em] font-semibold leading-[1.6] tracking-[0]">
              {category.category_name}
            </h6>
          </div>
        )}

        {/* Card Content */}
        <div className="flex-1 flex flex-col">
          {/* Title - Exact spacing from Elementor: margin 12px 10px 0 */}
          <h3 className="font-architects-daughter text-[1.25em] font-semibold leading-[1.5] tracking-[-0.005em] text-accent mx-[10px] mt-3 mb-0">
            {blog.post_title}
          </h3>

          {/* Excerpt - Exact from Elementor: Inter 0.85em, color #555555 */}
          {blog.excerpt && (
            <p className="font-inter text-[0.85em] font-normal leading-[1.6] text-muted-foreground mx-[10px] mt-2 mb-0 line-clamp-3">
              {blog.excerpt}
            </p>
          )}

          {/* Read More Button - Right aligned per Elementor */}
          <div className="mt-auto mx-[10px] mb-0 flex justify-end">
            <span className="font-inter text-[0.85em] font-bold uppercase text-accent">
              Read More
            </span>
          </div>

          {/* Post Info - Border top, Inter 0.85em per Elementor */}
          <div className="mt-2 pt-1 mx-0 border-t border-muted-foreground">
            <div className="flex items-center gap-4 px-3 py-1 text-[0.85em] font-inter font-semibold text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Uncle Bobby
              </span>
              <time dateTime={blog.created_at} className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {publishDate}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
