# Markdown Content Pages Implementation Plan

## Overview

Enable Markdown files stored under `src/page-content` to power statically generated routes (e.g., `src/page-content/example.md` → `/example`) while preserving front matter for page metadata, layout content, and discoverability.

## Current State Analysis

- `src/page-content/example.md` holds the only Markdown source today and already uses front matter fields (`title`, `date`, `summary`).
- `src/pages/_app.tsx:1-16` wraps only `/homework/3/*` routes with `PostProvider`; all other routes render as-is, so new pages must remain compatible with this check.
- `src/pages/index.tsx:8-76` is a static landing page without navigation to Markdown-backed content.
- No utilities exist for reading Markdown, no dynamic routes handle slugs, and the project lacks Markdown parsing dependencies or tests for this workflow.

## Desired End State

- Visiting `/example` renders the HTML produced from `example.md`, with the front matter mapped to visible header content and `<head>` metadata.
- Adding `src/page-content/<slug>.md` automatically creates a build-time route `/slug` without extra wiring.
- A discoverability entry point lists all Markdown pages with their summaries.
- Parsing and routing logic is type-safe, covered by unit tests, and lint/build pipelines remain green.

### Key Discoveries:

- `src/pages/_app.tsx:1-16` scopes context providers to specific route prefixes, so the Markdown route must avoid unintended provider wrapping.
- `src/pages/index.tsx:8-76` currently teaches the framework and can be extended to surface Markdown content summaries.
- `src/page-content/example.md:1-8` demonstrates the front matter contract we should consistently parse and validate.

## What We're NOT Doing

- Supporting nested directories or non-`.md` extensions inside `src/page-content` (flat structure only).
- Introducing MDX compilation or custom React components within Markdown (plain Markdown + remark plugins only).
- Building an authoring UI or CMS; content remains file-based and source-controlled.
- Changing existing `/homework/*` routes or reworking the `PostProvider` logic.

## Implementation Approach

Leverage Next.js Pages Router static generation (`getStaticPaths`/`getStaticProps`) to enumerate Markdown files, parse their content with `gray-matter` and `remark` at build time, and render them via a shared Markdown renderer component. Front matter becomes typed metadata used for page layout, `<Head>` tags, and list views. The plan progresses from foundational utilities to routing, navigation, and finally tooling/tests/documentation.

## Phase 1: Content Parsing Foundation

### Overview

Establish reusable utilities and dependencies that load Markdown files, extract front matter, and produce HTML/React nodes ready for rendering.

### Changes Required:

#### 1. Content utilities

**File**: `src/lib/content/markdown.ts`
**Changes**: Add functions to enumerate Markdown filenames, parse individual files, and transform Markdown to HTML/React components with remark plugins (e.g., GFM, syntax highlighting). Export typed metadata and helper guards.

```ts
export type MarkdownMeta = {
  title: string;
  date: string;
  summary: string;
  slug: string;
};

export async function loadMarkdown(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = await fs.promises.readFile(filePath, "utf8");
  const { content, data } = matter(raw);
  assertFrontMatter(data);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema)
    .process(content);
  return {
    meta: { ...data, slug } as MarkdownMeta,
    html: processed.toString(),
  };
}
```

#### 2. Dependency management

**File**: `package.json`
**Changes**: Add `gray-matter`, `remark`, `remark-gfm`, `remark-rehype`, `rehype-slug`, `rehype-autolink-headings`, `rehype-raw`, `rehype-sanitize` (or equivalent), plus TypeScript types if needed. Update lockfile accordingly.

#### 3. Types and shared constants

**File**: `src/lib/content/index.ts`
**Changes**: Export shared constants like `CONTENT_DIR = path.join(process.cwd(), "src/page-content")` and type guards for front matter validation.

### Success Criteria:

#### Automated Verification:

- [x] Dependency install succeeds (`npm install`).
- [x] Linting passes after adding new files: `npm run lint`.
- [x] Build succeeds with utilities imported in isolation: `npm run build`.

#### Manual Verification:

- [x] Loading `loadMarkdown("example")` in a node REPL returns expected metadata and HTML.
- [x] Invalid front matter throws a descriptive error during `npm run build`.

---

## Phase 2: Dynamic Routing & Page Rendering

### Overview

Create a generic Markdown page template that statically generates routes for all Markdown files, uses the parsing utilities, and renders content with proper metadata.

### Changes Required:

#### 1. Dynamic page entry

**File**: `src/pages/[slug].tsx`
**Changes**: Implement `getStaticPaths` to map filenames to slugs, `getStaticProps` to load the Markdown, and a React component that renders `<Head>` metadata plus the HTML (via `dangerouslySetInnerHTML` or a `MarkdownRenderer`). Ensure `fallback: false` for 404 on unknown slugs.

```tsx
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await listMarkdownSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};
```

#### 2. Markdown renderer component

**File**: `src/components/markdown/markdown-renderer.tsx`
**Changes**: Create a presentational component that safely renders the processed HTML, normalizes heading styles, and applies Tailwind classes.

#### 3. Metadata consumption

**File**: `src/pages/[slug].tsx`
**Changes**: Use `Head` to set `<title>` and `<meta name="description">` from front matter; render hero section showing title/date/summary before the Markdown body.

### Success Criteria:

#### Automated Verification:

- [x] Static generation completes without warnings: `npm run build`.
- [x] ESLint passes with the new page/component: `npm run lint`.

#### Manual Verification:

- [ ] Visiting `/example` in `npm run dev` displays front matter and Markdown body with expected formatting.
- [ ] Visiting an unknown slug (e.g., `/nope`) returns the Next.js 404 page.

---

## Phase 3: Listing & Navigation Updates

### Overview

Expose Markdown content through site navigation so users can discover available pages and ensure the flat directory assumption is encoded.

### Changes Required:

#### 1. Homepage listing

**File**: `src/pages/index.tsx`
**Changes**: Convert homepage to fetch Markdown metadata in `getStaticProps`, render a list of links (`<Link href={`/${meta.slug}`}>`) showing title, date, and summary, while preserving existing layout branding.

#### 2. Shared card component (optional)

**File**: `src/components/markdown/markdown-card.tsx`
**Changes**: Extract a reusable card UI for metadata display to keep homepage tidy.

#### 3. Documentation snippet

**File**: `README.md`
**Changes**: Document how to add new Markdown files and where their routes will appear.

### Success Criteria:

#### Automated Verification:

- [x] `npm run lint` succeeds with updated homepage logic.
- [x] `npm run build` regenerates homepage static props without errors.

#### Manual Verification:

- [ ] Homepage lists all Markdown files with accurate summaries and working links.
- [ ] Adding a new Markdown file locally and rerunning `npm run dev` makes it appear without code changes.

---

## Phase 4: Tooling, Testing, and Refinements

### Overview

Add automated coverage for parsing and routing helpers, ensure TypeScript safety, and polish developer ergonomics.

### Changes Required:

#### 1. Test setup

**File**: `package.json`, `tsconfig.json`, `tests/content.test.ts`
**Changes**: Introduce a lightweight test runner (e.g., `vitest`), wire `npm run test`, and add unit tests for `listMarkdownSlugs`, `loadMarkdown`, and error scenarios (missing file, invalid front matter).

#### 2. Type definitions & guards

**File**: `src/lib/content/markdown.ts`
**Changes**: Add runtime validation (e.g., `zod` or manual checks) ensuring required front matter fields are present and of the correct type; surface descriptive errors.

#### 3. Error handling UX

**File**: `src/pages/[slug].tsx`
**Changes**: Provide graceful fallback UI (build-time error messaging, optional dev-only warning) when metadata is incomplete.

#### 4. Styling pass

**File**: `src/styles/globals.css`
**Changes**: Add prose styling (Tailwind `prose` classes or custom CSS) to make Markdown output readable (headings, lists, code blocks).

### Success Criteria:

#### Automated Verification:

- [x] All tests pass: `npm run test`.
- [x] TypeScript project references compile: `npm run build` (includes type checking).
- [x] ESLint remains green: `npm run lint`.

#### Manual Verification:

- [ ] Markdown styling (headings, lists, code blocks) appears polished in the browser.
- [ ] Invalid front matter triggers a clear build-time error message identifying the offending file.

---

## Testing Strategy

### Unit Tests:

- Validate `listMarkdownSlugs` correctly strips `.md` and ignores hidden/temp files.
- Ensure `loadMarkdown` returns expected metadata and HTML for known fixtures.
- Confirm invalid front matter (missing `title`, `date`, or `summary`) throws descriptive errors.

### Integration Tests:

- (Optional future work) Add Playwright or Cypress test verifying `/example` renders expected headings.

### Manual Testing Steps:

1. Run `npm run dev` and visit `/example` to confirm layout, metadata in browser tab, and Markdown rendering.
2. Add a new Markdown file (e.g., `test.md`), restart dev server, and verify `/test` appears and renders.
3. Temporarily break front matter to verify build-time validation failure, then restore.

## Performance Considerations

- Static site generation keeps runtime overhead minimal; parsing happens during build.
- Keep remark/rehype plugin set lean to avoid slow builds; monitor build duration as Markdown count grows.
- Ensure HTML output is sanitized (`rehype-sanitize`) to prevent XSS from Markdown content.

## Migration Notes

- No data migrations required; ensure developers know to restart `npm run dev` after adding Markdown files.
- If future nested directories are needed, revisit slug generation and `getStaticPaths` to encode relative paths.

## References

- Existing app shell: `src/pages/_app.tsx`
- Homepage baseline: `src/pages/index.tsx`
- Source Markdown example: `src/page-content/example.md`
- Next.js Pages Router SSG docs: https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
