import type { InferGetStaticPropsType, GetStaticProps } from "next";

export const getStaticProps: GetStaticProps<{
  timeData: string;
}> = async () => {
  const now = new Date();
  const timeData = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
  return { props: { timeData }, revalidate: 10 };
};

export default function Page({
  timeData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <h1>ISR (Incremental Static Regeneration)</h1>
      <ul>
        <li>
          本頁使用 ISR（Incremental Static Regeneration）技術，每 10
          秒（根據請求）重新生成一次靜態頁面。
        </li>
        <li>請嘗試每隔 10 秒重新整理頁面，觀察時間是否更新。</li>
        <li>若在 10 秒內有請求，將回傳舊的 HTML。</li>
        <li>
          超過 10 秒後的首次請求仍會收到舊的 HTML，但此請求會觸發頁面重新生成。
        </li>
        <li>下一次請求即可獲得最新的 HTML 資料。</li>
        <li>因此，通常需要請求兩次才能看到最新資料。</li>
      </ul>
      <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{timeData}</div>
    </div>
  );
}
