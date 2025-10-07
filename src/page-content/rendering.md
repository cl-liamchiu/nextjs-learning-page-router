---
title: "Next.js Rendering 與 Data Fetching 筆記"
date: "2025-10-01"
summary: "整理 Next.js 四種 Rendering 模式（SSR、SSG、ISR、CSR）與 Data Fetching 方法的差異、流程與適合場景。"
tags: ["Next.js", "Rendering", "Data Fetching", "SSR", "SSG", "ISR", "CSR"]
---

# Next.js Rendering & Data Fetching 筆記

## Rendering 模式

### 1. **SSR (Server-Side Rendering)**

- 使用 `getServerSideProps`
- **執行時機**：每次 request
- **流程**：Server 在收到請求時 → 跑程式、抓資料 → 回傳完整 HTML → 瀏覽器 hydration
- **優點**：內容即時、SEO 佳
- **缺點**：每次都要計算，效能較差
- **適合情境**：Dashboard、個人化頁面、即時數據

```tsx
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
  return <div>{timeData}</div>;
}
```

[Example](/data-fetching/ssr)

---

### 2. **SSG (Static Site Generation)**

- 使用 `getStaticProps`
- **執行時機**：build 階段
- **流程**：build 時生成 HTML + JSON → 部署到 Server/CDN → 瀏覽器直接拿檔案
- **優點**：快（只傳檔案）、SEO 佳、可 CDN 快取
- **缺點**：內容固定，更新需要重新 build
- **適合情境**：Blog、Docs、產品頁

```tsx
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
```

[Example](/data-fetching/ssg)

---

### 3. **ISR (Incremental Static Regeneration)**

- `getStaticProps` + `revalidate`
- **執行時機**：build 階段 + 過期後第一次請求背景重生
- **流程**：

  - 初始 build → 產生 HTML + JSON
  - 過期後第一次 request → 先回舊檔案，背景跑一次 `getStaticProps` 更新
  - 下一次 request → 直接拿新的 HTML/JSON

- **優點**：兼顧效能與即時性
- **缺點**：內容可能會有短暫過期狀態
- **適合情境**：新聞首頁、排行榜、電商商品頁

```tsx
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
  return <div>{timeData}</div>;
}
```

[Example](/data-fetching/isr)

---

### 4. **CSR (Client-Side Rendering)**

- 不使用 `getStaticProps` / `getServerSideProps`，直接在 component 用 `useEffect` 或第三方庫（SWR, React Query）fetch 資料
- **執行時機**：瀏覽器載入後
- **流程**：瀏覽器先 render skeleton → 再透過 JS 抓資料 → 更新 DOM
- **優點**：高度互動、即時 API 呼叫
- **缺點**：SEO 不佳，首次渲染慢
- **適合情境**：聊天室、即時股票、內部工具

---

## Data Fetching 筆記

- **`getStaticProps`**：在 build 階段執行，只能在伺服器端跑，不會出現在瀏覽器 bundle，適合預先生成內容。
- **`getServerSideProps`**：在每次 request 時執行，能依照 request context 回傳不同資料。
- **API Routes (`/api`)**：給 Client Side 或第三方服務呼叫；Server Side 不需要透過 API Route，多餘。
- **lib/ 資料夾**：建議把 fetch 資料的邏輯抽到這裡，方便 API Routes 與 SSR/SSG 共用。
- **瀏覽器行為**：

  - HTML/JS 檔案存在 **Server/CDN**，不是 LocalStorage
  - 瀏覽器下載 JS 後會放在 **記憶體 (RAM)** 執行，並快取到 **磁碟 (Disk Cache)**，下次載入更快。

---

## 比喻

- **SSR**：餐廳現做 → 新鮮但要等
- **SSG**：便利商店便當 → 立刻拿到，但不是最新
- **ISR**：便利商店便當 + 定時補貨 → 快又能更新
- **CSR**：到家自己煮 → 要等資料抓回來才能吃
