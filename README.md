# Bloccato

Minimalist Italian blog built with a custom static site generator.

## Design Philosophy

Bloccato follows Muji-inspired minimalism:
- Clean, functional design
- Emphasis on negative space
- Content-first approach
- Natural, muted color palette
- No unnecessary decoration

## Technology Stack

- **Static Site Generator**: Custom Node.js build system
- **Markdown Parser**: markdown-it with typography support
- **Search**: Pagefind (client-side static search)
- **Hosting**: GitHub Pages
- **Deployment**: GitHub Actions

## Project Structure

```
bloccato/
├── content/posts/       # Markdown blog posts
├── src/                 # Build system source code
│   ├── build.js        # Main build orchestrator
│   ├── parsers/        # Frontmatter and Markdown parsers
│   ├── templates/      # HTML templates
│   └── utils/          # Utility functions
├── static/             # Static assets (CSS, favicons, fonts)
│   ├── css/            # Muji-inspired stylesheets
│   ├── favicon.svg     # Main browser favicon
│   ├── apple-touch-icon.svg  # iOS home screen icon
│   ├── icon-*.svg      # PWA icons (192x192, 512x512)
│   ├── manifest.json   # Web app manifest
│   └── CNAME           # GitHub Pages custom domain
├── public/             # Generated site (gitignored, auto-built)
├── tests/              # Jest test suite (64 tests)
├── scripts/            # Utility scripts (WordPress export, screenshots)
└── .github/workflows/  # GitHub Actions CI/CD
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
# Build the site
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Start local server
npm run dev
```

The site will be available at `http://localhost:8080`

## Writing Posts

Create a new Markdown file in `content/posts/` with the following frontmatter:

```markdown
---
title: "Your Post Title"
date: 2026-01-09
category: Tecnico
tags: [tag1, tag2]
excerpt: "Optional custom excerpt"
---

Your content here in Markdown...
```

### Required Fields

- `title`: Post title
- `date`: Publication date (YYYY-MM-DD)
- `category`: Post category (e.g., Tecnico, Salute, Generale)

### Optional Fields

- `tags`: Array of tags
- `excerpt`: Custom excerpt (auto-generated if not provided)

### Filename Convention

Posts should be named: `YYYY-MM-DD-slug.md`

Example: `2026-01-09-my-first-post.md`

### Twitter/X Embeds

The blog automatically converts Twitter/X URLs into embedded tweets:

```markdown
Check out this tweet:

https://twitter.com/username/status/1234567890

It will display inline!
```

Both `twitter.com` and `x.com` URLs are supported.

## Migrating from WordPress

1. Export your WordPress content:
   - WordPress Admin → Tools → Export → All content

2. Run the export script:
   ```bash
   npm run export path/to/wordpress-export.xml
   ```

3. Review converted posts in `content/posts/`

4. Build the site:
   ```bash
   npm run build
   ```

## Deployment

You have **two deployment options** for GitHub Pages:

### Option 1: Local Build (Recommended for Simplicity)

Build locally and push the static files:

```bash
npm run build
git add .
git commit -m "New post"
git push
# Live in ~30 seconds
```

**Pros:** Simple, fast, full control
**Cons:** Manual build step

### Option 2: GitHub Actions (Automated)

Push markdown files, GitHub builds and deploys automatically:

```bash
git add content/posts/new-post.md
git commit -m "New post"
git push
# GitHub builds and deploys (2-3 minutes)
```

**Pros:** Automated, tests run automatically
**Cons:** Slightly slower
**Cost:** FREE for public repositories

**See [DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md) for detailed comparison and switching instructions.**

### Migrating to GitHub Pages

If you're migrating from another hosting provider (e.g., DigitalOcean):

**[MIGRATION_INSTRUCTIONS.md](./MIGRATION_INSTRUCTIONS.md)**

Covers:
- GitHub repository setup (both deployment methods)
- DNS configuration (Namecheap)
- Custom domain setup
- SSL/HTTPS configuration
- Testing and verification

### Custom Domain

The site is configured for `bloccato.xyz`:

1. CNAME file: `static/CNAME`
2. DNS: GitHub Pages A records
3. HTTPS: Enforced via GitHub Pages settings

## Development Workflow

### Running Tests

All functionality is test-driven:

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Code Structure

- **Utilities** (`src/utils/`): Pure functions for dates, slugs, excerpts
- **Parsers** (`src/parsers/`): Frontmatter and Markdown parsing
- **Templates** (`src/templates/`): HTML generation
- **Generators**: Page builders using templates
- **Build**: Orchestrates the entire build process

## Features

### Content & Publishing
- ✅ Markdown posts with frontmatter
- ✅ Categories and tags
- ✅ Auto-generated excerpts
- ✅ Twitter/X embed support (automatic inline tweet display)
- ✅ Archive page (organized by year/month)
- ✅ Pagination (20 posts per page)

### Search & Discovery
- ✅ Client-side search (Pagefind) with Italian language support
- ✅ Muji-styled search interface with subtle highlighting
- ✅ Responsive search UI (mobile/tablet/desktop)

### Technical Features
- ✅ RSS feed (feed.xml)
- ✅ Sitemap.xml for SEO
- ✅ Favicon system (SVG-based, multi-size)
- ✅ PWA support (web app manifest)
- ✅ Custom 404 handling

### Design & UX
- ✅ Muji-inspired minimalist design
- ✅ Fully responsive (mobile-first)
- ✅ Italian language support
- ✅ SEO optimized
- ✅ Print-friendly styles
- ✅ Theme color meta tags

## Performance

- First Contentful Paint: < 1.0s (3G)
- Lighthouse Score: > 95
- Minimal JavaScript (search only)
- Optimized fonts

## Favicon & PWA

The blog includes a complete icon system:

- **favicon.svg** - Modern SVG favicon (64x64, scalable)
- **apple-touch-icon.svg** - iOS home screen icon (180x180, rounded corners)
- **icon-192.svg** - Android PWA icon (192x192)
- **icon-512.svg** - High-res PWA icon (512x512)
- **manifest.json** - Web app manifest for "Add to Home Screen"

**Design:** Minimalist "B" lettermark in accent color (#8B7355) on warm background (#FAFAF8), matching Muji aesthetic.

**Location:** All icons are SVG format in `static/` directory and copied to `public/` during build.

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Architecture Documentation

See detailed documentation:
- [DESIGN_SPEC.md](./DESIGN_SPEC.md) - Visual design system
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [PROJECT_STATE.md](./PROJECT_STATE.md) - Development state

## Accessibility

Bloccato meets WCAG 2.1 Level AA standards:
- Semantic HTML
- Proper heading hierarchy
- Keyboard navigation
- Screen reader support
- High contrast ratios
- Focus indicators

## Support

For issues or questions, please open an issue on GitHub.
