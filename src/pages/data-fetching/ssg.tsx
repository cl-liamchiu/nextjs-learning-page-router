import type { InferGetStaticPropsType, GetStaticProps } from "next";

export const getStaticProps: GetStaticProps<{
  timeData: string;
}> = async () => {
  const now = new Date();
  const timeData = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  return { props: { timeData } };
};

export default function Page({
  timeData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <div>{timeData}</div>;
}
