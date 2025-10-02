import Link from "next/link";
import type { FC } from "react";

import type { MarkdownMeta } from "@/lib/content";

type MarkdownCardProps = {
  meta: MarkdownMeta;
};

const MarkdownCard: FC<MarkdownCardProps> = ({ meta }) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(meta.date));

  return (
    <Link
      href={`/${meta.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        {formattedDate}
      </p>
      <h2 className="text-xl font-semibold text-neutral-900 transition group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-300">
        {meta.title}
      </h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        {meta.summary}
      </p>
      <span className="text-sm font-medium text-blue-600 transition group-hover:translate-x-1 dark:text-blue-300">
        Read more →
      </span>
    </Link>
  );
};

export default MarkdownCard;
