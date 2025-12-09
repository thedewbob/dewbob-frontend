import { createDirectus, rest, readItems, staticToken } from '@directus/sdk';
import { logger } from './logger';

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
  featured_image: string | null; // UUID of directus_files
  category_id: number | null; // Direct category reference
  // Relations
  scripts?: Script;
  scripts_id?: Script;
  seo?: SEO[];
  images?: Image[]; // Legacy - to be removed
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

// Menu System Interfaces
export interface Menu {
  id: string;
  name: string;
  site: string;
  location: 'header' | 'footer' | 'hero';
  status: 'draft' | 'published';
  menu_items?: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  label: string;
  url: string;
  parent_id: string | null;
  sort: number;
  target: '_self' | '_blank';
  icon: string | null;
  status: 'draft' | 'published';
  children?: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  site: string;
  site_name: string | null;
  site_tagline: string | null;
  header_menu_id: string | null;
  footer_menu_id: string | null;
  logo: string | null;
  footer_image: string | null;
  footer_quote: string | null;
  copyright_text: string | null;
  social_facebook_url: string | null;
  social_twitter_url: string | null;
  social_instagram_url: string | null;
  social_youtube_url: string | null;
  google_analytics_id: string | null;
  google_tag_manager_id: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
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
  collection: 'component_hero' | 'component_post_rotator' | 'component_category_grid' | 'component_alternating_content';
  item: ComponentHero | ComponentPostRotator | ComponentCategoryGrid | ComponentAlternatingContent;
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

export interface ComponentAlternatingContent {
  id: string;
  heading: string | null;
  content_blocks: Array<{ component_alt_content_blocks_id: ComponentAltContentBlock }>;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface ComponentAltContentBlock {
  id: string;
  sort: number;
  image: string | null;
  image_alt: string | null;
  content: string | null;
  status: 'draft' | 'published';
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
  component_alternating_content: ComponentAlternatingContent[];
  component_alt_content_blocks: ComponentAltContentBlock[];
  menus: Menu[];
  menu_items: MenuItem[];
  site_settings: SiteSettings[];
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
export const getPublishedBlogsCount = async (featuredOnly = false) => {
  const filter: any = {
    status: {
      _eq: 'published',
    },
  };

  if (featuredOnly) {
    filter.featured = {
      _eq: true,
    };
  }

  // Fetch in batches
  let allBlogs: any[] = [];
  let page = 0;
  const batchSize = 100;
  let hasMore = true;

  while (hasMore) {
    const batch = await directus.request(
      readItems('blogs', {
        filter,
        limit: batchSize,
        offset: page * batchSize,
        fields: ['blogs_id'],
      })
    );

    allBlogs = allBlogs.concat(batch);
    hasMore = batch.length === batchSize;
    page++;
  }

  return allBlogs.length;
};

export const getPublishedBlogs = async (limit = 10, offset = 0, featuredOnly = false) => {
  const filter: any = {
    status: {
      _eq: 'published',
    },
  };

  if (featuredOnly) {
    filter.featured = {
      _eq: true,
    };
  }

  return await directus.request(
    readItems('blogs', {
      filter,
      sort: ['-scripts_id.air_date', '-created_at'],
      limit,
      offset,
      fields: [
        '*',
        { scripts_id: ['*', { topics_id: ['*', { ub_category_id: ['*'] }] }] },
        { category_id: ['*'] },
        { seo: ['*'] },
        { featured_image: ['*'] },
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
        { category_id: ['*'] },
        { seo: ['*'] },
        { featured_image: ['*'] },
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

export const getBlogsByCategoryCount = async (categoryId: number) => {
  try {
    // Fetch ALL blogs in batches
    let allBlogs: any[] = [];
    let page = 0;
    const batchSize = 100;
    let hasMore = true;

    while (hasMore) {
      const batch = await directus.request(
        readItems('blogs', {
          filter: {
            status: { _eq: 'published' },
          },
          limit: batchSize,
          offset: page * batchSize,
          fields: ['blogs_id', 'category_id', { category_id: ['*'] }],
        })
      );

      allBlogs = allBlogs.concat(batch);
      hasMore = batch.length === batchSize;
      page++;
    }

    // Filter by category - using direct category_id on blogs
    const filteredBlogs = allBlogs.filter((blog: any) => {
      // category_id might be an object with category_id property, or just the ID
      const blogCategoryId = typeof blog.category_id === 'object'
        ? blog.category_id?.category_id
        : blog.category_id;
      return blogCategoryId === categoryId;
    });

    return filteredBlogs.length;
  } catch (error) {
    logger.error('Error counting blogs by category:', JSON.stringify(error, null, 2));
    return 0;
  }
};

export const getBlogsByCategory = async (categoryId: number, limit = 10, offset = 0) => {
  try {
    // Fetch ALL blogs in batches to bypass Directus max limit
    let allBlogs: any[] = [];
    let page = 0;
    const batchSize = 100;
    let hasMore = true;

    while (hasMore) {
      const batch = await directus.request(
        readItems('blogs', {
          filter: {
            status: { _eq: 'published' },
          },
          sort: ['-scripts_id.air_date', '-created_at'],
          limit: batchSize,
          offset: page * batchSize,
          fields: [
            '*',
            { scripts_id: ['*', { topics_id: ['*', { ub_category_id: ['*'] }] }] },
            { category_id: ['*'] },
            { seo: ['*'] },
            { featured_image: ['*'] },
          ],
        })
      );

      allBlogs = allBlogs.concat(batch);
      hasMore = batch.length === batchSize;
      page++;
    }

    // Filter by category - using direct category_id on blogs
    const filteredBlogs = allBlogs.filter((blog: any) => {
      // category_id might be an object with category_id property, or just the ID
      const blogCategoryId = typeof blog.category_id === 'object'
        ? blog.category_id?.category_id
        : blog.category_id;
      return blogCategoryId === categoryId;
    });

    logger.debug(`Category ${categoryId}: Total blogs=${allBlogs.length}, Filtered=${filteredBlogs.length}, Sample category_id type=${typeof allBlogs[0]?.category_id}`);

    // Apply pagination
    return filteredBlogs.slice(offset, offset + limit);
  } catch (error) {
    logger.error('Error fetching blogs by category:', JSON.stringify(error, null, 2));
    return [];
  }
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
        'blocks.item:component_alternating_content.*',
        'blocks.item:component_alternating_content.content_blocks.component_alt_content_blocks_id.*',
      ],
    })
  );

  // Filter by site in code since sites is a JSON field
  const page = results.find((p: any) => p.sites && p.sites.includes(site));

  return page || null;
};

// Menu System Helper Functions

export const getMenuByLocation = async (location: 'header' | 'footer' | 'hero', site: string = 'dewbob') => {
  try {
    // Fetch all published menus for this site
    const allMenus = await directus.request(
      readItems('menus', {
        filter: {
          site: { _eq: site },
          status: { _eq: 'published' },
        },
        fields: ['*'],
      })
    );

    // Filter by location in code (location is multi-select JSON array)
    const menu = allMenus.find((m: any) => {
      if (Array.isArray(m.location)) {
        return m.location.includes(location);
      }
      return m.location === location;
    });

    if (!menu) return null;

    // Now fetch menu items separately
    const menuItems = await directus.request(
      readItems('menu_items', {
        filter: {
          menu_id: { _eq: menu.id },
          status: { _eq: 'published' },
          parent_id: { _null: true }, // Top-level items only
        },
        sort: ['sort'],
      })
    );

    return {
      ...menu,
      menu_items: menuItems,
    };
  } catch (error) {
    logger.error('Error fetching menu:', JSON.stringify(error, null, 2));
    return null;
  }
};

export const getMenuItemChildren = async (parentId: string) => {
  return await directus.request(
    readItems('menu_items', {
      filter: {
        parent_id: { _eq: parentId },
        status: { _eq: 'published' },
      },
      sort: ['sort'],
    })
  );
};

export const getSiteSettings = async (site: string = 'dewbob') => {
  try {
    const results = await directus.request(
      readItems('site_settings', {
        filter: {
          site: { _eq: site },
          status: { _eq: 'published' },
        },
        fields: ['*'], // Get all fields as stored
        limit: 1,
      })
    );

    return results[0] || null;
  } catch (error) {
    logger.error('Error fetching site settings:', error);
    return null;
  }
};
