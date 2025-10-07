import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

interface Props {
  slug: string;
}

const DynamicPage: React.FC<Props> = ({ slug }) => {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Dynamic Page: {slug}</h1>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // 範例：預先產生這兩個 slug 的頁面
  const paths = [{ params: { slug: "apple" } }, { params: { slug: "banana" } }];
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params as { slug: string };
  return {
    props: { slug },
  };
};

export default DynamicPage;
