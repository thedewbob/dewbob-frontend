#!/bin/bash

# Fix unused imports
sed -i 's/import { getImageUrl, getImageAlt } from "@\/lib\/image-utils";//g' components/blog/blog-card-v2.tsx
sed -i "s/import { readItems, readItem, staticToken }/import { readItems, staticToken }/g" lib/directus.ts
sed -i "s/, request: NextRequest//g" app/api/search/route.ts
sed -i "s/import { getMenuItemChildren,/import {/g" components/layout/header.tsx

# Fix 'any' types
find . -type f -name "*.tsx" -o -name "*.ts" | while read file; do
  sed -i "s/(blog.featured_image as any)\?\.id/(blog.featured_image as { id?: string })?.id/g" "$file"
  sed -i "s/(blog as any)\.category_id/(blog as { category_id?: unknown }).category_id/g" "$file"
  sed -i "s/(prevPost.featured_image as any)\?\.id/(prevPost.featured_image as { id?: string })?.id/g" "$file"
  sed -i "s/(nextPost.featured_image as any)\?\.id/(nextPost.featured_image as { id?: string })?.id/g" "$file"
done

# Fix React unescaped entities
sed -i "s/Uncle Bobby's advice/Uncle Bobby\&apos;s advice/g" components/search/search-results.tsx
sed -i "s/Looks like you've taken/Looks like you\&apos;ve taken/g" app/not-found.tsx
sed -i "s/It's either moved/It\&apos;s either moved/g" app/not-found.tsx
sed -i "s/Search results for: /Search results for: /g" components/search/search-results.tsx
sed -i 's/"No results found for \\"/"No results found for \&quot;/g' components/search/search-results.tsx
sed -i 's/\\"$/\&quot;/g' components/search/search-results.tsx

echo "Done!"
