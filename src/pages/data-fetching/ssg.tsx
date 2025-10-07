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
  return (
    <div>
      <h1>SSG (Static Site Generation)</h1>
      <ul>
        <li>
          本頁使用 SSG（Static Site Generation）技術，在建置時生成靜態頁面。
        </li>
        <li>請嘗試重新整理頁面，觀察時間是否更新。</li>
        <li>無論重新整理多少次，時間都不會改變，因為頁面是靜態生成的。</li>
        <li>若要看到最新時間，需重新建置並部署應用程式。</li>
      </ul>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{timeData}</div>
    </div>
  );
}
