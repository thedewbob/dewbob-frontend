import { Blog } from "@/lib/directus";
import { BlogCard } from "./blog-card";

interface BlogGridProps {
  blogs: Blog[];
}

export function BlogGrid({ blogs }: BlogGridProps) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
      {blogs.map((blog) => (
        <BlogCard key={blog.blogs_id} blog={blog} />
      ))}
    </div>
  );
}
