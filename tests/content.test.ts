import fs from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  CONTENT_DIR,
  MarkdownNotFoundError,
  listMarkdownSlugs,
  loadMarkdown,
} from "@/lib/content/markdown";

const TEMP_INVALID_SLUG = "__invalid-front-matter-test";
const TEMP_INVALID_PATH = path.join(CONTENT_DIR, `${TEMP_INVALID_SLUG}.md`);

async function createInvalidMarkdownFixture() {
  const invalidSource = `---\ntitle: Missing summary\ndate: "2025-10-02"\n---\n\n# Heading\n`;
  await fs.writeFile(TEMP_INVALID_PATH, invalidSource, "utf8");
}

async function cleanupInvalidMarkdownFixture() {
  await fs.rm(TEMP_INVALID_PATH, { force: true });
}

describe("content markdown helpers", () => {
  it("lists markdown slugs in the content directory", async () => {
    const slugs = await listMarkdownSlugs();

    expect(slugs).toContain("example");
    expect(slugs.every((slug) => !slug.endsWith(".md"))).toBe(true);
  });

  it("loads markdown content with metadata", async () => {
    const result = await loadMarkdown("example");

    expect(result.meta).toMatchObject({
      slug: "example",
      title: expect.any(String),
      summary: expect.any(String),
    });
    expect(result.html).toMatch(/<h1[\s>]/);
  });

  it("throws a specific error when file is missing", async () => {
    await expect(loadMarkdown("__does-not-exist__")).rejects.toBeInstanceOf(
      MarkdownNotFoundError
    );
  });

  it("validates front matter and surfaces descriptive errors", async () => {
    await createInvalidMarkdownFixture();

    try {
      await expect(loadMarkdown(TEMP_INVALID_SLUG)).rejects.toThrow(
        /front matter must include/i
      );
    } finally {
      await cleanupInvalidMarkdownFixture();
    }
  });
});
