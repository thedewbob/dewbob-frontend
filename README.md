# DewBob Frontend

Next.js 15 frontend application for DewBob.com - "Ask Uncle Bobby" advice platform with Directus CMS integration.

## Tech Stack

- **Framework:** Next.js 15.5.4 (App Router, React 19)
- **CMS:** Directus (Headless CMS)
- **Styling:** Tailwind CSS 4
- **TypeScript:** Full type safety
- **Deployment:** Docker with standalone output

## Prerequisites

- Node.js 20+
- npm or pnpm
- Directus CMS instance (production or development)

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Directus CMS Configuration
NEXT_PUBLIC_DIRECTUS_URL=https://cms.dewbob.com
DIRECTUS_TOKEN=your_directus_static_token

# Optional: Enable debug logging in production
NEXT_PUBLIC_DEBUG=false
```

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t dewbob/dewbob:latest .

# Push to DockerHub
docker push dewbob/dewbob:latest

# Run with docker-compose
docker-compose up -d
```

## Project Structure

```
/app                    # Next.js App Router pages
  /api                 # API routes (search, etc.)
  /ask-uncle-bobby     # Blog post pages
  /about               # About page
  /search              # Search functionality
/components            # React components
  /layout             # Header, Footer, Container
  /blog               # Blog cards, sliders
  /page-builder       # Directus page builder components
  /search             # Search components
  /ui                 # Reusable UI components
/lib                   # Utilities and configurations
  directus.ts         # Directus SDK client & queries
  logger.ts           # Environment-based logging utility
/public                # Static assets
docker-compose.yml     # Docker Compose configuration
Dockerfile             # Multi-stage Docker build
```

## Key Features

### Content Management
- **Directus Integration:** All content managed through Directus CMS
- **Dynamic Pages:** Page builder system for flexible layouts
- **Blog System:** Categories, featured posts, pagination
- **SEO Optimization:** Dynamic metadata from Directus

### Performance
- **ISR (Incremental Static Regeneration):** 60-second revalidation
- **Dynamic Rendering:** No build-time data fetching (runtime only)
- **Image Optimization:** Next.js Image component with Directus assets
- **Standalone Output:** Optimized Docker builds

### User Experience
- **Search:** Client-side fuzzy search with Fuse.js
- **Responsive Design:** Mobile-first approach
- **Hero Carousel:** Auto-rotating image carousel
- **Post Navigation:** Prev/next navigation within categories

## Logging

The application uses an environment-aware logging system:

```typescript
import { logger } from '@/lib/logger';

// Debug/Info - only in development or when NEXT_PUBLIC_DEBUG=true
logger.debug('Debug message');
logger.info('Info message');

// Warn/Error - always logged
logger.warn('Warning message');
logger.error('Error message');
```

## Configuration Files

- **next.config.ts:** Next.js configuration with standalone output
- **tailwind.config.ts:** Tailwind CSS customization
- **.dockerignore:** Files excluded from Docker builds
- **docker-compose.yml:** Production deployment configuration

## Directus Collections

The application uses these Directus collections:

- `blogs` - Blog posts
- `scripts` - Q&A content with air dates
- `ub_categories` - Blog categories
- `seo` - SEO metadata
- `pages` - Dynamic pages
- `menus` - Navigation menus
- `site_settings` - Global site configuration

## Development Notes

### Forcing Dynamic Rendering

All pages use `export const dynamic = 'force-dynamic'` in the root layout to prevent static generation during build. This allows:
- Environment variables to be read at runtime
- Content changes in Directus without rebuilds
- Flexible deployment to any environment

### Mobile Responsiveness

- Header includes hamburger menu for mobile with Directus-driven navigation
- Hero section has responsive navigation (smaller font, wrapped layout on mobile)
- All components are mobile-first with Tailwind breakpoints

### Docker Production Build

The Dockerfile uses multi-stage builds:
1. **deps:** Install dependencies
2. **builder:** Build Next.js app with placeholder env vars
3. **runner:** Production runtime with actual env vars from docker-compose

## Deployment

### Portainer Stack

Use the included `docker-compose.yml` for Portainer deployment:

1. Create stack in Portainer
2. Paste docker-compose.yml content
3. Set environment variables:
   - `NEXT_PUBLIC_DIRECTUS_URL`
   - `DIRECTUS_TOKEN`
4. Deploy stack

The container exposes port 3000 and includes health checks.

## Contributing

This is a private project for DewBob.com. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved.
