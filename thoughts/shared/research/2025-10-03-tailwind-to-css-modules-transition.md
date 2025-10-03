---
date: 2025-10-03T17:58:15+08:00
researcher: Liam Chiu
git_commit: ea80f4569d7e82004dbb08d72df76f9b23a93f02
branch: main
repository: nextjs-learning-page-router
topic: "Identify Tailwind CSS usage for migration to CSS Modules/Sass"
tags: [research, codebase, tailwind, styling]
status: complete
last_updated: 2025-10-03
last_updated_by: Liam Chiu
---

# Research: Identify Tailwind CSS usage for migration to CSS Modules/Sass

**Date**: 2025-10-03T17:58:15+08:00  
**Researcher**: Liam Chiu  
**Git Commit**: ea80f4569d7e82004dbb08d72df76f9b23a93f02  
**Branch**: main  
**Repository**: nextjs-learning-page-router

## Research Question

Document everywhere Tailwind CSS is configured or employed so a future migration to CSS Modules and Sass can be scoped.

## Summary

The project relies on Tailwind v4 through a global `@import "tailwindcss"` statement and PostCSS plugin wiring, without a dedicated `tailwind.config` file. Styling is primarily authored inline via utility class strings across Pages Router entries and shared components, especially within the Markdown listing flow and the Homework feature set. Canvas-based demos and modal/form experiences also lean on Tailwind utilities for layout, typography, and color. No CSS Modules exist today, and the metadata script referenced in the research template (`hack/spec_metadata.sh`) is absent in this repository.

## Detailed Findings

### Tailwind toolchain entry points

- `src/styles/globals.css:1-138` imports Tailwind globally and layers custom CSS for markdown typography and color tokens.
- `src/pages/_app.tsx:1-16` ensures the global stylesheet (and thus Tailwind) is applied to every route while selectively wrapping `/homework/3/*` pages in `PostProvider`.
- `postcss.config.mjs:1-5` registers the `@tailwindcss/postcss` plugin, which enables Tailwind v4 processing.
- `package.json:26-36` lists `tailwindcss@^4` and `@tailwindcss/postcss@^4` in `devDependencies`, confirming Tailwind v4 usage.
- There is no `tailwind.config.js` checked in, so all classes come from Tailwind defaults plus the utilities generated from inline usage.

### Landing page and global layout styling

- `src/pages/index.tsx:32-64` composes font variables from the Geist families and applies Tailwind utilities for grid layout, spacing, and responsive behavior on the landing page container and hero section.
- `src/components/markdown/markdown-card.tsx:16-31` defines the card visual treatment (borders, colors, hover states) entirely with Tailwind classes, reused for each markdown article entry.
- `src/components/markdown/markdown-renderer.tsx:7-10` anchors rendered Markdown HTML inside a div with the `markdown-body` class, relying on the custom CSS defined in `globals.css`.
- `src/pages/[slug].tsx:78-90` sets up article-level spacing, typography, and dark-mode variants using Tailwind utilities for the markdown detail page.
- `src/pages/_document.tsx:7-10` attaches the `antialiased` Tailwind utility to the `<body>` element, adjusting text rendering for the entire document.

### Homework shell components

- `src/components/homework/homework-layout.tsx:6-10` and `src/components/homework/homework-content.tsx:8-17` use Tailwind flexbox, spacing, and max-width utilities to define the shared homework page scaffold.
- `src/components/homework/homework-sidebar.tsx:19-35` styles the sidebar background, typography, and active link colors via Tailwind utilities, switching between highlighted and hover states.
- `src/components/homework/homework-description.tsx:13-21` applies rounded corners, borders, and background overlays for the homework brief block.
- `src/pages/homework/index.tsx:5-9` sets homework landing typography via Tailwind heading utilities.

### Homework assignments 1 & 2

- `src/pages/homework/1/index.tsx:42-90` relies on Tailwind for flex layouts, responsive stacking, form controls, and validation feedback styling.
- `src/pages/homework/2/index.tsx:51-83` uses Tailwind utilities to build the action button row and draggable card styling for the dynamic components list.

### Homework assignment 3 (post board)

- `src/pages/homework/3/index.tsx:12-18` styles the entry CTA link with Tailwind color and hover utilities.
- `src/pages/homework/3/post-board.tsx:88-230` contains extensive Tailwind usage for the dashboard layout, interactive buttons, card states, modal form fields, and dark theme palette.
- `src/pages/homework/3/create-post.tsx:48-144` mirrors the board styling for the creation form, including Tailwind-powered file input adornments and button states.
- `src/components/homework/3/modal.tsx:27-43` manages overlay positioning, z-index, and theming via Tailwind utilities.

### Homework assignments 4 & 5 (canvas demos)

- `src/lib/homework/4/canvas-image-editor.tsx:99-149` wraps the canvas editor with Tailwind-based layout, button states, and hidden file input handling.
- `src/lib/homework/5/image-zoom-demo.tsx:47-99` applies similar Tailwind patterns for the zoom demo’s layout, instructions, and reset button.

### Markdown content support

- `src/lib/content/index.ts` (via imports observed in pages) exposes Markdown helpers; while not styling-related, the rendered markdown surfaces rely on the Tailwind-enhanced `markdown-body` CSS class.
- `tests/content.test.ts:1-102` validates markdown utilities but does not introduce styling; this test suite ensures the content shown within Tailwind-styled components is consistent.

### Other tailwind touchpoints

- Utility classes appear in smaller contexts such as the landing page image (`src/pages/index.tsx:40-44`) and body-level typography adjustments, reinforcing that Tailwind is the default styling approach everywhere dynamic layout is needed.

## Code References

- `src/styles/globals.css:1-138` – Global Tailwind import and markdown typography rules.
- `postcss.config.mjs:1-5` – Tailwind PostCSS plugin registration.
- `package.json:26-36` – Tailwind dependencies declared.
- `src/pages/_app.tsx:1-16` – Global stylesheet import covering all routes.
- `src/pages/index.tsx:32-64` – Landing page layout using Tailwind utilities.
- `src/components/markdown/markdown-card.tsx:16-31` – Card component styled with Tailwind.
- `src/pages/[slug].tsx:78-90` – Markdown article layout using Tailwind.
- `src/components/homework/homework-layout.tsx:6-10` – Homework scaffold styling.
- `src/components/homework/homework-sidebar.tsx:19-35` – Sidebar colors and hover states.
- `src/pages/homework/1/index.tsx:42-90` – Homework form controls styled with Tailwind.
- `src/pages/homework/3/post-board.tsx:88-230` – Post board layout and modal styling via Tailwind.
- `src/lib/homework/4/canvas-image-editor.tsx:99-149` – Canvas demo controls using Tailwind classes.
- `src/lib/homework/5/image-zoom-demo.tsx:47-99` – Zoom demo layout and file input styling.
- `src/pages/_document.tsx:7-10` – `antialiased` utility applied at document level.

## Architecture Documentation

Tailwind is consumed through the modern v4 pipeline (global import + PostCSS plugin) rather than via a bespoke configuration file, so utility generation is inferred from usage in JSX. Each feature area embeds Tailwind classes directly in component `className` attributes instead of using separate style modules or component-scoped styles. The Markdown experience splits responsibilities between Tailwind-styled layout wrappers and conventional CSS rules in `globals.css` for typographic defaults. The Homework feature suite centralizes shared layout scaffolding (`HomeworkLayout`, `HomeworkContent`, `HomeworkDescription`) and layers Tailwind utilities for forms, modals, and interactive states, giving a consistent dark-themed interface. Canvas-based demos follow the same inline utility pattern, combining Tailwind for layout and button styling with imperative canvas logic.

## Historical Context (from thoughts/)

- `thoughts/shared/plans/2025-10-02-markdown-page-routing.md:7-184` describes the introduction of markdown pages and notes how `src/pages/index.tsx` and related components were structured at that time, which aligns with the current Tailwind-driven layout.

## Related Research

None recorded in `thoughts/shared/research/` prior to this document.

## Open Questions

- The repository lacks the `hack/spec_metadata.sh` helper referenced in the research template; metadata for this document was collected manually.
- Researcher identity was assumed as "Liam Chiu" because no `thoughts` status file specifying researcher names exists; confirm the preferred attribution if needed.
