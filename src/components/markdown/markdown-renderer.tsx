import type { FC } from "react";

type MarkdownRendererProps = {
  html: string;
};

const MarkdownRenderer: FC<MarkdownRendererProps> = ({ html }) => {
  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default MarkdownRenderer;
