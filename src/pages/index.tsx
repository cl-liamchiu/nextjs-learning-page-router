import Image from "next/image";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import MarkdownCard from "@/components/markdown/markdown-card";
import { loadMarkdownIndex, type MarkdownMeta } from "@/lib/content";
import styles from "./index.module.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type HomeProps = {
  markdown: MarkdownMeta[];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const markdown = await loadMarkdownIndex();

  return {
    props: {
      markdown,
    },
  };
};

export default function Home({
  markdown,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} ${styles.page}`}
    >
      <main className={styles.main}>
        <div className={styles.hero}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <section className={styles.content}>
          {markdown.length === 0 ? (
            <p className={styles.emptyState}>
              No Markdown content yet. Add a file like{" "}
              <code>src/page-content/hello.md</code> to see it here.
            </p>
          ) : (
            <div className={styles.cardGrid}>
              {markdown.map((meta) => (
                <MarkdownCard key={meta.slug} meta={meta} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
