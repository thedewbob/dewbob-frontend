import { NextRequest, NextResponse } from 'next/server';
import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    // Fetch all published blogs in batches
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

    return NextResponse.json({ data: allBlogs });
  } catch (error) {
    logger.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
