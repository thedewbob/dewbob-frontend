import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { HeaderWrapper as Header } from "@/components/layout/header-wrapper";
import { SearchResults } from "@/components/search/search-results";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Ask Uncle Bobby",
  description: "Search for Uncle Bobby's advice",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function SearchPage() {
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
              Search Results
            </h1>
          </Container>
        </section>

        {/* Search Results */}
        <section className="py-12">
          <Container>
            <Suspense fallback={<div className="text-center">Loading...</div>}>
              <SearchResults />
            </Suspense>
          </Container>
        </section>
      </div>
    </>
  );
}
