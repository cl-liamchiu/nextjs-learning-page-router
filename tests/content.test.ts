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
const TEMP_ASSET_SLUG = "__asset-path-rewrite-test";
const TEMP_ASSET_PATH = path.join(CONTENT_DIR, `${TEMP_ASSET_SLUG}.md`);

async function createInvalidMarkdownFixture() {
  const invalidSource = `---\ntitle: Missing summary\ndate: "2025-10-02"\n---\n\n# Heading\n`;
  await fs.writeFile(TEMP_INVALID_PATH, invalidSource, "utf8");
}

async function cleanupInvalidMarkdownFixture() {
  await fs.rm(TEMP_INVALID_PATH, { force: true });
}

async function createAssetPathMarkdownFixture() {
  const source = `---
title: Asset Path Rewrite
date: "2025-10-14"
summary: "Ensures /public prefixes are normalized"
---

![Screenshot](/public/example.png)

[Download](/public/example.pdf)
`;

  await fs.writeFile(TEMP_ASSET_PATH, source, "utf8");
}

async function cleanupAssetPathMarkdownFixture() {
  await fs.rm(TEMP_ASSET_PATH, { force: true });
}

describe("content markdown helpers", () => {
  it("lists markdown slugs in the content directory", async () => {
    const slugs = await listMarkdownSlugs();

    expect(slugs).toContain("app-vs-page");
    expect(slugs.every((slug) => !slug.endsWith(".md"))).toBe(true);
  });

  it("loads markdown content with metadata", async () => {
    const result = await loadMarkdown("app-vs-page");

    expect(result.meta).toMatchObject({
      slug: "app-vs-page",
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

  it("rewrites /public/ asset prefixes to root-relative paths", async () => {
    await createAssetPathMarkdownFixture();

    try {
      const result = await loadMarkdown(TEMP_ASSET_SLUG);

      expect(result.html).toContain('src="/example.png"');
      expect(result.html).toContain('href="/example.pdf"');
      expect(result.html).not.toContain("/public/");
    } finally {
      await cleanupAssetPathMarkdownFixture();
    }
  });
});
