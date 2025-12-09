import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { HeaderWrapper as Header } from "@/components/layout/header-wrapper";
import { getCategories, getBlogsByCategory, getBlogsByCategoryCount } from "@/lib/directus";
import { logger } from "@/lib/logger";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryFilterButton } from "@/components/ui/category-filter-button";
import type { Metadata } from "next";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find(
    (cat) => cat.category_slug === slug || String(cat.category_id) === slug
  );

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `Uncle Bobby's ${category.category_name} | Ask Uncle Bobby`,
    description: category.description || `Browse ${category.category_name} advice from Uncle Bobby`,
  };
}

// Enable ISR - Category pages will revalidate every 60 seconds
export const revalidate = 60;

export default async function CategoryArchivePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10);
  const postsPerPage = 12;

  // Get all categories for the filter tabs
  const allCategories = await getCategories();

  // Find the current category
  const category = allCategories.find(
    (cat) => cat.category_slug === slug || String(cat.category_id) === slug
  );

  if (!category) {
    notFound();
  }

  // Get total count and blogs for this category
  const offset = (currentPage - 1) * postsPerPage;
  const [totalCount, blogs] = await Promise.all([
    getBlogsByCategoryCount(category.category_id),
    getBlogsByCategory(category.category_id, postsPerPage, offset),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / postsPerPage);

  logger.debug(`Category page: ${category.category_name} (ID: ${category.category_id}) - Count: ${totalCount}, Page: ${currentPage}, TotalPages: ${totalPages}, Blogs: ${blogs.length}`);

  return (
    <>
      <Header />
      <div className="bg-[#FDF8F3] min-h-screen">
      {/* Category Header */}
      <section className="bg-[#B8472D] py-12 text-center">
        <Container>
          <h1
            className="text-4xl md:text-5xl text-[#FDF8F3] mb-4"
            style={{ fontFamily: "var(--font-architects-daughter)" }}
          >
            Uncle Bobby&apos;s {category.category_name}
          </h1>
          {category.description && (
            <p className="text-[#FDF8F3] text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
        </Container>
      </section>

      {/* Category Filter Tabs - Exact from element 64be1b67 */}
      <section style={{ backgroundColor: 'hsl(var(--secondary))', padding: '30px 0' }}>
        <Container>
          <nav className="flex flex-wrap items-center justify-center gap-[30px]">
            <CategoryFilterButton href="/ask-uncle-bobby" isActive={false}>
              All
            </CategoryFilterButton>
            {allCategories.map((cat) => {
              const isActive = cat.category_id === category.category_id;
              return (
                <CategoryFilterButton
                  key={cat.category_id}
                  href={`/ask-uncle-bobby/category/${cat.category_slug || cat.category_id}`}
                  isActive={isActive}
                >
                  {cat.category_name}
                </CategoryFilterButton>
              );
            })}
          </nav>
        </Container>
      </section>

      {/* Blog Grid */}
      <section className="py-12">
        <Container>
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog.blogs_id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {currentPage > 1 && (
                    <Link
                      href={`/ask-uncle-bobby/category/${slug}?page=${currentPage - 1}`}
                      className="px-4 py-2 rounded-[25px] bg-[#3D7F78] text-white hover:bg-[#336B66] transition-colors"
                    >
                      Previous
                    </Link>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isCurrentPage = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={`/ask-uncle-bobby/category/${slug}?page=${pageNum}`}
                        className={`px-4 py-2 rounded-[25px] transition-colors ${
                          isCurrentPage
                            ? "bg-[#9C3A25] text-white"
                            : "bg-[#FDF8F3] text-[#2D2D3F] hover:bg-[#9C3A25] hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}

                  {currentPage < totalPages && (
                    <Link
                      href={`/ask-uncle-bobby/category/${slug}?page=${currentPage + 1}`}
                      className="px-4 py-2 rounded-[25px] bg-[#3D7F78] text-white hover:bg-[#336B66] transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2
                className="text-2xl text-[#2D2D3F] mb-4"
                style={{ fontFamily: "var(--font-architects-daughter)" }}
              >
                No posts in this category yet.
              </h2>
              <Link
                href="/ask-uncle-bobby"
                className="inline-block px-6 py-3 bg-[#3D7F78] text-white rounded-[25px] hover:bg-[#336B66] transition-colors"
              >
                View All Posts
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
    </>
  );
}
