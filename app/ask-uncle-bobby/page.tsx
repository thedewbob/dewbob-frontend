import Link from "next/link";
import { Container } from "@/components/layout/container";
import { HeaderWrapper as Header } from "@/components/layout/header-wrapper";
import { getCategories, getPublishedBlogs, getPublishedBlogsCount } from "@/lib/directus";
import { BlogCard } from "@/components/blog/blog-card";
import { CategoryFilterButton } from "@/components/ui/category-filter-button";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Ask Uncle Bobby | Life, Work, Relationship & Social Advice",
    description: "Browse all advice from Uncle Bobby. Get answers to life's questions with Uncle Bobby's unique perspective.",
  };
}

// Enable ISR - Archive page will revalidate every 60 seconds
export const revalidate = 60;

export default async function AskUncleBobbyPage({ searchParams }: PageProps) {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10);
  const postsPerPage = 12;

  // Get all categories for the filter tabs
  const allCategories = await getCategories();

  // Get total count and blogs for pagination
  const offset = (currentPage - 1) * postsPerPage;
  const [totalCount, blogs] = await Promise.all([
    getPublishedBlogsCount(),
    getPublishedBlogs(postsPerPage, offset),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / postsPerPage);

  return (
    <>
      <Header />
      <div className="bg-[#FDF8F3] min-h-screen">
      {/* Page Header */}
      <section className="bg-[#B8472D] py-12 text-center">
        <Container>
          <h1
            className="text-4xl md:text-5xl text-[#FDF8F3] mb-4"
            style={{ fontFamily: "var(--font-architects-daughter)" }}
          >
            Ask Uncle Bobby
          </h1>
          <p className="text-[#FDF8F3] text-lg max-w-2xl mx-auto">
            Browse all of Uncle Bobby's advice on life, work, relationships, and social situations.
          </p>
        </Container>
      </section>

      {/* Category Filter Tabs - Exact from element 64be1b67 */}
      <section style={{ backgroundColor: 'hsl(var(--secondary))', padding: '30px 0' }}>
        <Container>
          <nav className="flex flex-wrap items-center justify-center gap-[30px]">
            <CategoryFilterButton href="/ask-uncle-bobby" isActive={true}>
              All
            </CategoryFilterButton>
            {allCategories.map((cat) => {
              return (
                <CategoryFilterButton
                  key={cat.category_id}
                  href={`/ask-uncle-bobby/category/${cat.category_slug || cat.category_id}`}
                  isActive={false}
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
                      href={`/ask-uncle-bobby?page=${currentPage - 1}`}
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
                        href={`/ask-uncle-bobby?page=${pageNum}`}
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
                      href={`/ask-uncle-bobby?page=${currentPage + 1}`}
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
                No posts available yet.
              </h2>
            </div>
          )}
        </Container>
      </section>
    </div>
    </>
  );
}
