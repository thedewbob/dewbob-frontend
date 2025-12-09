import Link from "next/link";
import { Blog } from "@/lib/directus";

interface SliderCardProps {
  blog: Blog;
}

export function SliderCard({ blog }: SliderCardProps) {
  const slug = blog.slug || blog.blogs_id?.toString() || "";
  const featuredImageId = typeof blog.featured_image === 'string'
    ? blog.featured_image
    : (blog.featured_image as { id?: string })?.id;
  const imageUrl = featuredImageId
    ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${featuredImageId}`
    : null;
  const title = blog.post_title || "Untitled";

  return (
    <Link
      href={`/ask-uncle-bobby/${slug}`}
      className="flex flex-col items-center justify-center gap-[10px] bg-white border-[3px] border-[#3D7F78] rounded-[25px] shadow-[8px_12px_20px_rgba(0,0,0,0.15)] m-[0.2em] p-[10px] hover:scale-105 transition-transform no-underline"
    >
      {/* Row: Circular Image + Title */}
      <div className="flex flex-row items-center justify-between gap-[10px] w-full">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="w-16 h-16 object-cover rounded-full"
          />
        )}
        <h3
          className="text-[1.25em] font-semibold text-[#1A1A1A] flex-1"
          style={{ fontFamily: "var(--font-architects-daughter)" }}
        >
          {title}
        </h3>
      </div>

      {/* Read More Button */}
      <button
        className="text-[0.75em] text-center px-4 py-2 bg-[#B8472D] text-white rounded-[25px] hover:bg-[#9C3A25] transition-colors uppercase font-semibold"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        Read More
      </button>
    </Link>
  );
}
