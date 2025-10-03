import Link from "next/link";
import type { FC } from "react";

import type { MarkdownMeta } from "@/lib/content";
import styles from "./markdown-card.module.scss";

type MarkdownCardProps = {
  meta: MarkdownMeta;
};

const MarkdownCard: FC<MarkdownCardProps> = ({ meta }) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(meta.date));

  return (
    <Link href={`/${meta.slug}`} className={styles.link}>
      <p className={styles.date}>{formattedDate}</p>
      <h2 className={styles.title}>{meta.title}</h2>
      <p className={styles.summary}>{meta.summary}</p>
      <span className={styles.readMore}>Read more →</span>
    </Link>
  );
};

export default MarkdownCard;
