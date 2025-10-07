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
import styles from "./markdown-page.module.scss";

type MarkdownPageProps = {
  doc: MarkdownDocument;
};

type MarkdownPageParams = {
  slug: string;
};

export const getStaticPaths: GetStaticPaths<MarkdownPageParams> = async () => {
  const slugs = await listMarkdownSlugs();

  return {
    paths: slugs
      .filter((slug) => slug !== "homework") // Exclude conflicting path
      .map((slug) => ({ params: { slug } })),
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
      <article className={styles.article}>
        <header className={styles.header}>
          <p className={styles.meta}>{formattedDate}</p>
          <h1 className={styles.title}>{meta.title}</h1>
          <p className={styles.summary}>{meta.summary}</p>
        </header>
        <MarkdownRenderer html={html} />
      </article>
    </>
  );
}
