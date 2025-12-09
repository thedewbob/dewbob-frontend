'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { BlogCard } from '@/components/blog/blog-card';
import type { Blog } from '@/lib/directus';
import { logger } from '@/lib/logger';

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  // Fetch all blogs on mount
  useEffect(() => {
    async function fetchBlogs() {
      try {
        // Use our API route to avoid CORS issues
        const response = await fetch('/api/search');
        const data = await response.json();
        const blogs = data.data || [];

        setAllBlogs(blogs);
        logger.debug(`Search: Fetched ${blogs.length} total blogs`);
      } catch (error) {
        logger.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Search when query changes
  useEffect(() => {
    if (!query || allBlogs.length === 0) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(allBlogs, {
      keys: [
        { name: 'post_title', weight: 2 },
        { name: 'excerpt', weight: 1.5 },
        { name: 'body', weight: 1 },
        { name: 'blog_copy', weight: 1 },
      ],
      threshold: 0.4,
      includeScore: true,
    });

    const searchResults = fuse.search(query);
    const mappedResults = searchResults.map(result => result.item);
    logger.debug(`Search: Query="${query}", AllBlogs=${allBlogs.length}, Results=${mappedResults.length}`);
    setResults(mappedResults);
  }, [query, allBlogs]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-[#2D2D3F]">Loading...</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-[#2D2D3F]">Enter a search term to find Uncle Bobby's advice.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2
          className="text-2xl text-[#2D2D3F] mb-2"
          style={{ fontFamily: "var(--font-architects-daughter)" }}
        >
          Search results for: <span className="text-[#3D7F78]">"{query}"</span>
        </h2>
        <p className="text-[#555555]">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((blog) => (
            <BlogCard key={blog.blogs_id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#2D2D3F] text-lg mb-4">
            No results found for "{query}"
          </p>
          <p className="text-[#555555]">
            Try different keywords or browse all posts.
          </p>
        </div>
      )}
    </div>
  );
}
