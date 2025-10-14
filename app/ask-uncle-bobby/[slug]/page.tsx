import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/directus";
import { getImageUrl, getImageAlt } from "@/lib/image-utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all published blogs
export async function generateStaticParams() {
  const blogs = await getPublishedBlogs(100); // Fetch more for static generation

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

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
    <article className="py-12">
      <Container className="max-w-4xl">
        {/* Category Badge */}
        {category && (
          <div className="mb-4">
            <Link
              href={`/category/${category.category_id}`}
              className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider no-underline hover:bg-accent-hover transition-colors"
            >
              {category.category_name}
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="font-architects-daughter text-4xl md:text-5xl text-secondary mb-4">
          {blog.post_title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-muted-foreground mb-8 text-sm">
          <time dateTime={blog.created_at}>{publishDate}</time>
        </div>

        {/* Featured Image */}
        {imageUrl && (
          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden mb-8">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {blog.body ? (
            <div dangerouslySetInnerHTML={{ __html: blog.body }} />
          ) : blog.blog_copy ? (
            <div dangerouslySetInnerHTML={{ __html: blog.blog_copy }} />
          ) : (
            <p className="text-muted-foreground">No content available.</p>
          )}
        </div>

        {/* Valediction */}
        {blog.valediction && (
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-lg italic text-muted-foreground">{blog.valediction}</p>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center text-accent hover:text-accent-hover font-semibold"
          >
            ← Back to all posts
          </Link>
        </div>
      </Container>
    </article>
  );
}
