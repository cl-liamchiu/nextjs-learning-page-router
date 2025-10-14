# Enable Syntax Highlighting for Markdown Code Snippets

## Overview

This plan outlines the steps to enable syntax highlighting for code snippets in markdown pages. The goal is to integrate the `rehype-highlight` library into the markdown rendering process and ensure that code snippets are displayed with appropriate syntax highlighting.

## Current State Analysis

### Markdown Rendering

- **Component**: `MarkdownRenderer`
  - **File**: `src/components/markdown/markdown-renderer.tsx`
  - Renders HTML content using `dangerouslySetInnerHTML`.

### Markdown Processing

- **Processor**: `markdownProcessor`
  - **File**: `src/lib/content/markdown.ts`
  - Converts markdown to HTML using `remark` and `rehype` plugins.
  - Current plugins:
    - `remarkGfm`: GitHub Flavored Markdown support.
    - `remarkRehype`: Converts markdown AST to HTML AST.
    - `rehypeRaw`: Processes raw HTML in markdown.
    - `rehypeSanitize`: Sanitizes HTML output.
    - `rehypeSlug`: Adds `id` attributes to headings.
    - `rehypeStringify`: Converts HTML AST to a string.

### Styles for Code Snippets

- **File**: `src/styles/globals.scss`
  - Inline code (`code`) and code blocks (`pre`) are styled with background colors, border radius, and monospace fonts.

### Syntax Highlighting Library

- **Library**: `rehype-highlight`
  - Installed but not integrated.
  - Provides syntax highlighting for code blocks during markdown-to-HTML conversion.

## Desired End State

- Code snippets in markdown pages are syntax-highlighted using `rehype-highlight`.
- The highlighting is visually consistent with the existing design.
- The implementation is efficient and does not introduce performance issues.

## What We're NOT Doing

- Customizing themes or languages for `rehype-highlight` beyond its default configuration.
- Refactoring unrelated parts of the markdown rendering process.

## Implementation Approach

### Phase 1: Integrate `rehype-highlight` into `markdownProcessor`

#### Overview

Add the `rehype-highlight` plugin to the `markdownProcessor` configuration to enable syntax highlighting.

#### Changes Required:

##### 1. Update `markdownProcessor` Configuration

**File**: `src/lib/content/markdown.ts`
**Changes**:

- Import `rehype-highlight`.
- Add `rehype-highlight` to the processor pipeline.

```typescript
import rehypeHighlight from "rehype-highlight";

const markdownProcessor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeRaw)
  .use(rehypeSanitize, defaultSchema)
  .use(rehypeSlug)
  .use(rehypeHighlight) // Add syntax highlighting
  .use(rehypeStringify);
```

### Phase 2: Test and Verify Syntax Highlighting

#### Overview

Ensure that the integration works as expected and that code snippets are highlighted correctly.

#### Changes Required:

##### 1. Add Test Markdown Files

- Create test markdown files with various code snippets.
- Verify that the highlighting works for different languages.

##### 2. Manual Testing

- Render markdown pages in the browser.
- Verify that code snippets are highlighted correctly.

### Phase 3: Update Styles (if necessary)

#### Overview

Ensure that the global styles in `globals.scss` complement the syntax highlighting.

#### Changes Required:

##### 1. Review Existing Styles

- Check if the current styles for `code` and `pre` elements need adjustments.

##### 2. Update Styles

- Modify `globals.scss` if necessary to improve the appearance of highlighted code snippets.

## Testing Strategy

### Unit Tests:

- Verify that the `markdownProcessor` processes code blocks with `rehype-highlight`.

### Integration Tests:

- Test the rendering of markdown pages with code snippets.

### Manual Testing Steps:

1. Open a markdown page with code snippets in the browser.
2. Verify that the snippets are highlighted correctly.
3. Test with different programming languages.

## Performance Considerations

- Ensure that the addition of `rehype-highlight` does not significantly impact the performance of markdown processing.

## Migration Notes

- No migration is required as this change only affects the rendering process.

## References

- Research document: `thoughts/shared/research/2025-10-09-colorful-code-snippets.md`
- `rehype-highlight` documentation: [https://github.com/rehypejs/rehype-highlight](https://github.com/rehypejs/rehype-highlight)
