import { createDirectus, rest, readItems, readItem, staticToken } from '@directus/sdk';

// Type definitions based on DewBob CMS schema
export interface Blog {
  blogs_id: number;
  scripts_id: number | null;
  post_title: string;
  blog_copy: string | null;
  excerpt: string | null;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  created_at: string;
  updated_at: string;
  valediction: string | null;
  body: string | null;
  // Relations
  scripts?: Script;
  seo?: SEO[];
  images?: Image[];
}

export interface Script {
  scripts_id: number;
  topics_id: number | null;
  question: string | null;
  answer: string | null;
  questioner_name: string | null;
  valediction: string | null;
  air_date: string | null;
  status: 'draft' | 'approved' | 'published';
  created_at: string;
  updated_at: string;
  // Relations
  topics?: Topic;
}

export interface SEO {
  seo_id: number;
  blogs_id: number;
  focus_keyphrase: string | null;
  seo_title: string | null;
  seo_title_char: string | null;
  meta_description: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface Image {
  images_id: number;
  image_ref: string | null;
  image_name: string | null;
  image_title: string | null;
  image_alt_text: string | null;
  image_caption: string | null;
  image_description: string | null;
  post_label: string | null;
  image_upload: string | null;
  image_prompt: string | null;
  status: 'draft' | 'published';
  image_url: string | null;
  blogs_id: number | null;
  directus_file_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  topics_id: number;
  topic_name: string;
  theme_summary: string | null;
  source: string | null;
  ub_category_id: number | null;
  status: 'draft' | 'active' | 'archived';
  suggested_keyphrases: string | null;
  notes: string | null;
  content_angle: string | null;
  ub_tone_id: number | null;
  created_at: string;
  updated_at: string;
  // Relations
  ub_category?: UBCategory;
  ub_tone?: UBTone;
}

export interface UBCategory {
  category_id: number;
  category_name: string;
  category_slug: string | null;
  image: string | null;
  description: string | null;
  seo_id: number | null;
}

export interface UBTone {
  tone_id: number;
  tone_name: string;
}

// Page Builder Interfaces
export interface Page {
  id: string;
  slug: string;
  title: string;
  status: 'draft' | 'published';
  seo_id: number | null;
  site: string | null;
  blocks?: PageBlock[];
  created_at: string;
  updated_at: string;
}

export interface PageBlock {
  id: string;
  collection: 'component_hero' | 'component_post_rotator' | 'component_category_grid';
  item: ComponentHero | ComponentPostRotator | ComponentCategoryGrid;
  sort: number;
}

export interface ComponentHero {
  id: string;
  heading_1: string | null;
  heading_2: string | null;
  subheading: string | null;
  button_1_text: string | null;
  button_1_url: string | null;
  button_2_text: string | null;
  button_2_url: string | null;
  show_search: boolean;
  search_placeholder: string | null;
  carousel_images: string[];
  created_at: string;
  updated_at: string;
}

export interface ComponentPostRotator {
  id: string;
  heading: string | null;
  post_count: number;
  filter_featured: boolean;
  category_filter: number | null;
  created_at: string;
  updated_at: string;
}

export interface ComponentCategoryGrid {
  id: string;
  heading: string | null;
  categories: Array<{ ub_categories_category_id: UBCategory }>;
  created_at: string;
  updated_at: string;
}

// Directus Schema Definition
export interface Schema {
  blogs: Blog[];
  scripts: Script[];
  seo: SEO[];
  images: Image[];
  topics: Topic[];
  ub_categories: UBCategory[];
  ub_tones: UBTone[];
  pages: Page[];
  component_hero: ComponentHero[];
  component_post_rotator: ComponentPostRotator[];
  component_category_grid: ComponentCategoryGrid[];
}

// Create Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
const directusToken = process.env.DIRECTUS_TOKEN;

if (!directusUrl) {
  throw new Error('NEXT_PUBLIC_DIRECTUS_URL is not defined in environment variables');
}

// Create client with optional token for private collections
export const directus = createDirectus<Schema>(directusUrl)
  .with(rest())
  .with(
    staticToken(directusToken || '')
  );

// Helper functions for common queries
export const getPublishedBlogs = async (limit = 10, offset = 0) => {
  return await directus.request(
    readItems('blogs', {
      filter: {
        status: {
          _eq: 'published',
        },
      },
      sort: ['-created_at'],
      limit,
      offset,
      fields: [
        'blogs_id',
        'scripts_id',
        'post_title',
        'blog_copy',
        'excerpt',
        'slug',
        'status',
        'featured',
        'created_at',
        'updated_at',
        'valediction',
        'body',
        { scripts: ['*'] },
        { seo: ['*'] },
        { images: ['*'] },
      ],
    })
  );
};

export const getBlogBySlug = async (slug: string) => {
  const results = await directus.request(
    readItems('blogs', {
      filter: {
        slug: {
          _eq: slug,
        },
        status: {
          _eq: 'published',
        },
      },
      limit: 1,
      fields: [
        '*',
        { scripts: ['*', { topics: ['*', { ub_category: ['*'] }, { ub_tone: ['*'] }] }] },
        { seo: ['*'] },
        { images: ['*'] },
      ],
    })
  );

  return results[0] || null;
};

export const getCategories = async () => {
  return await directus.request(
    readItems('ub_categories', {
      sort: ['category_name'],
    })
  );
};

export const getBlogsByCategory = async (categoryId: number, limit = 10, offset = 0) => {
  return await directus.request(
    readItems('blogs', {
      filter: {
        status: {
          _eq: 'published',
        },
        scripts: {
          topics: {
            ub_category_id: {
              _eq: categoryId,
            },
          },
        },
      },
      sort: ['-created_at'],
      limit,
      offset,
      fields: [
        '*',
        { scripts: ['*', { topics: ['*', { ub_category: ['*'] }] }] },
        { seo: ['*'] },
        { images: ['*'] },
      ],
    })
  );
};

export const getPageBySlug = async (slug: string, site: string = 'dewbob') => {
  const results = await directus.request(
    readItems('pages', {
      filter: {
        slug: { _eq: slug },
        status: { _eq: 'published' },
      },
      fields: [
        '*',
        'blocks.*',
        'blocks.item:component_hero.*',
        'blocks.item:component_hero.carousel_images.directus_files_id.*',
        'blocks.item:component_post_rotator.*',
        'blocks.item:component_category_grid.*',
        'blocks.item:component_category_grid.categories.ub_categories_category_id.*',
      ],
    })
  );

  // Filter by site in code since sites is a JSON field
  const page = results.find((p: any) => p.sites && p.sites.includes(site));

  return page || null;
};
