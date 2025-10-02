import Head from "next/head";
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";

import MarkdownRenderer from "@/components/markdown/markdown-renderer";
import type { MarkdownDocument } from "@/lib/content";
import {
  listMarkdownSlugs,
  loadMarkdown,
  MarkdownNotFoundError,
} from "@/lib/content";

type MarkdownPageProps = {
  doc: MarkdownDocument;
};

type MarkdownPageParams = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths<MarkdownPageParams> = async () => {
  const slugs = await listMarkdownSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  MarkdownPageProps,
  MarkdownPageParams
> = async ({ params }) => {
  if (!params?.slug) {
    return {
      notFound: true,
    };
  }

  try {
    const doc = await loadMarkdown(params.slug);

    return {
      props: {
        doc,
      },
    };
  } catch (error) {
    if (error instanceof MarkdownNotFoundError) {
      return {
        notFound: true,
      };
    }

    throw error;
  }
};

export default function MarkdownPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { doc } = props;
  const { meta, html } = doc;

  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(meta.date));

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.summary} />
      </Head>
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-16">
        <header className="border-b border-neutral-200 pb-6 dark:border-neutral-800">
          <p className="text-sm uppercase tracking-wide text-neutral-500">
            {formattedDate}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {meta.title}
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
            {meta.summary}
          </p>
        </header>
        <MarkdownRenderer html={html} />
      </article>
    </>
  );
}
