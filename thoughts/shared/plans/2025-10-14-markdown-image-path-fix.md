# Fix Markdown Image Paths Implementation Plan

## Overview

Ensure Markdown-authored images resolve correctly by normalizing `/public/...` references during build time, updating existing content, and adding guardrails so future Markdown documents cannot regress.

## Current State Analysis

- Markdown content under `src/page-content` is parsed via `loadMarkdown` using remark/rehype, producing sanitized HTML without altering image sources (`src/lib/content/markdown.ts:34-90`).
- Pages render the generated HTML verbatim via `MarkdownRenderer`, so any incorrect URL embedded in Markdown ships to the browser unchanged (`src/pages/[slug].tsx:25-88`, `src/components/markdown/markdown-renderer.tsx:7-10`).
- The `redx-devtools.md` article references `![... ](/public/redux_devtools_screenshot.png)` (`src/page-content/redx-devtools.md:60`), leading browsers to request `/public/...`, which does not exist because Next.js serves static files from the root of `public/`.
- Existing tests validate metadata parsing and front matter enforcement but do not cover asset path integrity (`tests/content.test.ts:25-60`).

## Desired End State

Markdown images render successfully even if authors prefix paths with `/public/`, existing content is corrected, and automated coverage detects regressions.

### Key Discoveries:

- Remark/Rehype pipeline currently lacks custom handlers for resource URLs (`src/lib/content/markdown.ts:34-40`).
- Static assets live at `public/*`; paths should be site-root-relative (`/redux_devtools_screenshot.png`).
- The sanitizer allows `<img src>` but does not rewrite invalid prefixes, so additional processing is required.

## What We're NOT Doing

- Introducing MDX or embedding React components within Markdown.
- Supporting nested asset directories beyond the existing `public/` root.
- Building a CMS or authoring UI; scope is limited to static files and documentation.

## Implementation Approach

Augment the Markdown processing pipeline with a deterministic rewrite pass that strips a leading `/public/` from asset URLs, adjust content to follow the correct pattern, and extend automated tests plus documentation to enforce the rule.

## Phase 1: Normalize Asset Paths During Markdown Processing

### Overview

Add a transformation step so any `<img>` (and future-proof anchor) URLs beginning with `/public/` are rewritten to root-relative paths before HTML serialization.

### Changes Required:

#### 1. Markdown Processing Utility

**File**: `src/lib/content/markdown.ts`
**Changes**: Introduce a rehype plugin (either inline or extracted helper) that walks element nodes and rewrites `src`/`href` attributes starting with `/public/` to drop the prefix. Ensure the plugin runs before sanitization/stringify. Update typings if necessary.

```ts
function rehypeRewritePublicPaths() {
  return (tree: Root) => {
    visit(tree, (node: Element) => {
      if (!("properties" in node) || !node.properties) return;
      for (const key of ["src", "href"]) {
        const value = node.properties[key];
        if (typeof value === "string" && value.startsWith("/public/")) {
          node.properties[key] = value.replace(/^\/public\//u, "/");
        }
      }
    });
  };
}
```

#### 2. Type Imports

**File**: `src/lib/content/markdown.ts`
**Changes**: Import `visit` from `unist-util-visit` (add dependency if not already present) and relevant rehype types (`hast`). Update `package.json`/`pnpm-lock` if new dependencies required.

#### 3. Test Coverage

**File**: `tests/content.test.ts`
**Changes**: Add a fixture Markdown string referencing `/public/foo.png`, run it through `loadMarkdown`, and assert the resulting HTML contains `src="/foo.png"`. Optionally cover anchor tags to confirm reuse.

### Success Criteria:

#### Automated Verification:

- [x] Dependencies install cleanly after additions: `npm install`
- [x] Markdown helper tests cover normalization: `npm run test`
- [ ] TypeScript build succeeds: `npm run build` _(currently fails due to pre-existing `s.counter` selector mismatch in `src/pages/redux-example.tsx`)_
- [x] Linting passes with new plugin code: `npm run lint`

#### Manual Verification:

- [ ] Visit the `/redx-devtools` page in `npm run dev` and confirm the image loads.
- [ ] Add a temporary Markdown snippet with `/public/...` and verify it renders correctly after rebuild.

---

## Phase 2: Clean Existing Content and Document Authoring Guidance

### Overview

Update repository Markdown files to use root-relative asset paths and document the pattern so authors know what to expect.

### Changes Required:

#### 1. Markdown Content Audit

**Files**: `src/page-content/**/*.md`
**Changes**: Search for `/public/` references, replace them with the normalized root-relative paths, and verify assets exist. Focus on `redx-devtools.md`, but address any other occurrences discovered during audit.

#### 2. Documentation Update

**File**: `README.md` (or create `docs/content-authoring.md` referenced from README)
**Changes**: Add a brief note explaining that static assets belong in `public/` and Markdown should reference them via `/asset.png` without the `/public/` prefix. Mention the automatic rewrite as a safety net but emphasize best practice.

### Success Criteria:

#### Automated Verification:

- [x] Formatting/linting remains clean after content/doc updates: `npm run lint`
- [x] Tests continue to pass: `npm run test`

#### Manual Verification:

- [ ] Spot-check updated Markdown files to ensure links and images continue rendering in the generated site.
- [ ] Confirm documentation renders correctly and is discoverable by contributors.

---

## Phase 3: Regression Guardrails and Optional Enhancements

### Overview

Prevent future regressions by expanding tests and optionally adding build diagnostics for unresolved assets.

### Changes Required:

#### 1. Snapshot or Fixture Test

**File**: `tests/content.test.ts`
**Changes**: Extend the new test to cover multiple tags or introduce a snapshot test capturing the rendered HTML for a Markdown fixture containing images and anchors.

#### 2. Optional Warning Hook (if desired)

**File**: `src/lib/content/markdown.ts`
**Changes**: After rewriting paths, log or collect warnings in development for any asset path that does not resolve (e.g., using `fs.access` during build) to help authors catch typos. This step is optional and should be guarded behind `process.env.NODE_ENV === "development"` to avoid slowing production builds.

### Success Criteria:

#### Automated Verification:

- [x] Extended tests or snapshots pass: `npm run test`
- [ ] Build remains successful with optional warnings enabled: `npm run build`

#### Manual Verification:

- [ ] Trigger a deliberate typo in a Markdown asset path to observe the optional warning (if implemented) and then revert.

---

## Testing Strategy

### Unit Tests:

- Validate `loadMarkdown` rewrites `/public/example.png` to `/example.png`.
- Confirm anchor tags (`[link](/public/docs.pdf)`) undergo the same normalization if implemented.
- Ensure front matter validation still triggers for malformed metadata.

### Integration Tests:

- (Future enhancement) Snapshot test of a full Markdown document rendering through `[slug].tsx` to capture generated HTML structure.

### Manual Testing Steps:

1. Run `npm run dev`, navigate to `/redx-devtools`, and verify the screenshot renders.
2. Add a temporary Markdown file referencing `/public/temp-image.png`, ensure the asset exists, and confirm the page renders.
3. Remove the temporary file/asset and rerun tests to keep the repo clean.

## Performance Considerations

The rewrites operate on the Markdown AST per document. The additional tree traversal is lightweight compared to existing remark/rehype steps, so no noticeable build impact is expected. Optional asset existence checks should remain development-only to avoid slowing static generation.

## Migration Notes

- No database or state migrations are required.
- After updating Markdown files, ensure any cached static pages are rebuilt (`npm run build` or redeploy) so users receive the corrected HTML.

## References

- Research summary: `thoughts/shared/research/2025-10-14-markdown-image-path.md`
- Markdown loader implementation: `src/lib/content/markdown.ts:34-90`
- Dynamic markdown page renderer: `src/pages/[slug].tsx:25-88`
- Markdown rendering component: `src/components/markdown/markdown-renderer.tsx:7-10`
