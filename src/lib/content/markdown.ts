import fs from "node:fs/promises";
import path from "node:path";

import type { Element, Root } from "hast";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

export const CONTENT_DIR = path.join(process.cwd(), "src/page-content");

export type MarkdownMeta = {
  title: string;
  date: string;
  summary: string;
  slug: string;
};

export type MarkdownDocument = {
  meta: MarkdownMeta;
  html: string;
};

export class MarkdownNotFoundError extends Error {
  constructor(slug: string) {
    super(`Markdown file not found for slug: ${slug}`);
    this.name = "MarkdownNotFoundError";
  }
}

const PUBLIC_PATH_PREFIX = "/public/";

function rewritePublicPath(value: unknown): string | string[] | undefined {
  if (typeof value === "string") {
    if (!value.startsWith(PUBLIC_PATH_PREFIX)) {
      return undefined;
    }

    return value.replace(/^\/public\//u, "/");
  }

  if (Array.isArray(value)) {
    let mutated = false;
    const nextValues = value.map((entry) => {
      if (typeof entry === "string" && entry.startsWith(PUBLIC_PATH_PREFIX)) {
        mutated = true;
        return entry.replace(/^\/public\//u, "/");
      }

      return entry;
    });

    return mutated ? nextValues : undefined;
  }

  return undefined;
}

function rehypeRewritePublicPaths() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const { properties } = node;

      if (!properties) {
        return;
      }

      for (const attribute of ["src", "href"] as const) {
        const updated = rewritePublicPath(properties[attribute]);

        if (updated !== undefined) {
          properties[attribute] = updated;
        }
      }
    });
  };
}

const markdownProcessor = remark()
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeRaw)
  .use(rehypeRewritePublicPaths)
  .use(rehypeSanitize, defaultSchema)
  .use(rehypeSlug)
  .use(rehypeStringify);

function assertFrontMatter(
  data: unknown
): asserts data is Omit<MarkdownMeta, "slug"> {
  if (!data || typeof data !== "object") {
    throw new Error("Missing front matter metadata");
  }

  const { title, date, summary } = data as Record<string, unknown>;

  if (typeof title !== "string" || !title.trim()) {
    throw new Error("Front matter must include a non-empty 'title' field");
  }

  if (typeof date !== "string" || Number.isNaN(Date.parse(date))) {
    throw new Error("Front matter must include a valid 'date' field");
  }

  if (typeof summary !== "string" || !summary.trim()) {
    throw new Error("Front matter must include a non-empty 'summary' field");
  }
}

export async function listMarkdownSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/u, ""))
    .sort();
}

export async function loadMarkdown(slug: string): Promise<MarkdownDocument> {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(raw);
    assertFrontMatter(data);
    const html = String(await markdownProcessor.process(content));

    return {
      meta: {
        title: data.title,
        date: data.date,
        summary: data.summary,
        slug,
      },
      html,
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new MarkdownNotFoundError(slug);
    }

    throw error;
  }
}

export async function loadMarkdownMeta(slug: string): Promise<MarkdownMeta> {
  const { meta } = await loadMarkdown(slug);
  return meta;
}

export async function loadMarkdownIndex(): Promise<MarkdownMeta[]> {
  const slugs = await listMarkdownSlugs();
  const metas = await Promise.all(slugs.map((slug) => loadMarkdownMeta(slug)));

  return metas.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
