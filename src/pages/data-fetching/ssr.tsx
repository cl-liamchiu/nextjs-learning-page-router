import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps<{
  timeData: string;
}> = async () => {
  const now = new Date();
  const timeData = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  return { props: { timeData } };
};

export default function Page({
  timeData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <h1>SSR (Server-Side Rendering)</h1>
      <ul>
        <li>
          本頁使用 SSR（Server-Side
          Rendering）技術，每次請求都會在伺服器端生成最新的 HTML。
        </li>
        <li>請嘗試重新整理頁面，觀察時間是否更新。</li>
        <li>每次重新整理頁面，時間都會改變，因為頁面是動態生成的。</li>
      </ul>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{timeData}</div>
    </div>
  );
}
