This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Markdown Content Pages

Markdown files placed in `src/page-content` automatically become routes at build time. For example, adding `src/page-content/hello-world.md` will produce the page [/hello-world](http://localhost:3000/hello-world).

Each Markdown file should include front matter fields:

```markdown
---
title: "Lesson title"
date: "2025-10-01"
summary: "Short description used on listing pages."
---

# Heading

Your content here.
```

During development:

1. Create or update the Markdown file inside `src/page-content`.
2. Restart `npm run dev` if the file list changes (editing content hot-reloads automatically).
3. Visit the corresponding route (e.g., `/hello-world`).

The home page lists all Markdown entries with their summaries for quick navigation.

### Referencing Static Assets

- Place images or downloads under the project's `public/` directory.
- In Markdown, reference them with site-root paths such as `![Alt text](/asset-name.png)`.
- Avoid prefixing paths with `/public/`; the build pipeline rewrites legacy references, but following the root-relative pattern prevents broken links and keeps authored content consistent.
