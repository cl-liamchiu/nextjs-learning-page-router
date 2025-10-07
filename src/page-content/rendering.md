---
title: "Next.js Rendering 與 Data Fetching 筆記"
date: "2025-10-01"
summary: "整理 Next.js 四種 Rendering 模式（SSR、SSG、ISR、CSR）與 Data Fetching 方法的差異、流程與適合場景。"
tags: ["Next.js", "Rendering", "Data Fetching", "SSR", "SSG", "ISR", "CSR"]
---

# Next.js Rendering & Data Fetching 筆記

## Rendering 模式以及對應的 Data Fetching 方法

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

```tsx
import { useEffect, useState } from "react";

export default function Page() {
  const [timeData, setTimeData] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const time = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
    setTimeData(time);
  }, []);

  return <div>{timeData}</div>;
}
```

[Example](/data-fetching/csr)

## SEO 友善

相較於 React，Next.js 更加 SEO 友善。
原因在於搜尋引擎（例如 Google）在收錄網站內容時，會透過自動化的爬蟲（crawler）或檢索器（indexer）去抓取網頁的 HTML 資料，並依據網頁內容建立索引，最後再根據使用者輸入的關鍵字呈現搜尋結果。

然而，傳統的 React 應用程式屬於 Client-Side Rendering（CSR），頁面內容是由瀏覽器在載入後再透過 JavaScript 動態生成。
這表示若搜尋引擎的爬蟲無法或未執行 JavaScript，就無法看到實際的內容，只會看到一個幾乎空白的 HTML 結構，導致 無法正確收錄。

Next.js 則不同。它支援 Server-Side Rendering（SSR） 與 Static Site Generation（SSG），能在伺服器端預先生成完整的 HTML，並在頁面請求時直接傳給瀏覽器。
因此搜尋引擎爬蟲可以直接讀取到完整內容，使網頁更容易被索引與排名，達成 SEO 友善 的效果。

[React 網頁](https://cl-liamchiu.github.io/react-learning/)

## Automatic Static Optimization

- Next.js 在 build 階段會自動判斷頁面是否能靜態化。
  若頁面沒有使用 `getServerSideProps`，
  便會自動進行 靜態預先產生（Static Generation, SSG），這稱為自動靜態最佳化 (Automatic Static Optimization)。
- 如果頁面有部分地方使用到 `useEffect` 或其他 client-side code，但沒有使用 `getServerSideProps`，
  Next.js 仍然會將整個頁面靜態化，並在瀏覽器端執行那些 client-side code。
- 這樣的機制讓開發者不需要特別指定，就能享受到靜態頁面的效能優勢，同時也能在需要時使用 client-side code 來增強互動性。
- 例如：

  1. 剛剛例子中的 CSR 範例，
     雖然頁面內容是透過 `useEffect` 在 client 端取得，但因為沒有使用 `getServerSideProps`， Next.js 仍會在 build 階段預先輸出整個靜態 HTML（不含時間內容），並於瀏覽器端執行 `useEffect` 來更新實際時間。。

     ```tsx
     import { useEffect, useState } from "react";

     export default function Page() {
       const [timeData, setTimeData] = useState<string>("");

       useEffect(() => {
         const now = new Date();
         const time = now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });
         setTimeData(time);
       }, []);

       return (
         <div>
           <h1>CSR (Client Side Rendering)</h1>
           <ul>
             <li>本頁使用 CSR（Client Side Rendering）技術，時間每秒更新。</li>
             <li>重新整理頁面會立即獲得最新時間。</li>
           </ul>
           <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
             {timeData}
           </div>
         </div>
       );
     }
     ```

  2. 動態路由頁面（如 `[slug].tsx`）如果沒有使用 `getServerSideProps`，他也會預先生成靜態頁面，但跟 slug 有關的邏輯，因為不會預先知道 slug 是甚麼，所以會在 client 端執行相關邏輯來處理。

     ```tsx
     import React from "react";
     import { useRouter } from "next/router";

     const DynamicPage: React.FC = () => {
       const router = useRouter();
       console.log("slug:", router.query.slug);

       return (
         <main style={{ padding: "2rem" }}>
           <h1>Dynamic Page: {router.query.slug}</h1>
         </main>
       );
     };

     export default DynamicPage;
     ```

## 動態路由下的 SSG

- 動態路由頁面（如 `[id].tsx`）如果使用 `getStaticProps`，還需要搭配 `getStaticPaths` 來指定哪些路由參數需要預先生成靜態頁面。
- `getStaticPaths` 會在 build 階段執行，回傳一組路由參數清單，
  Next.js 會根據這些參數來生成對應的靜態頁面。
- 例如：

```tsx
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
```

- 在這個例子中，`getStaticPaths` 指定了兩個路由參數 `apple` 和 `banana`，Next.js 會在 build 階段生成這兩個靜態頁面。
- `fallback: "blocking"` 表示如果使用者請求的 slug 不在預先生成的清單中，Next.js 會在伺服器端生成該頁面，並在生成完成後回傳給使用者，同時將該頁面加入到靜態頁面中以供未來使用。
- 如果是 `fallback: false`，則表示只有預先生成的 slug 可以被訪問，其他的會回傳 404。
- `fallback: true` 則會先回傳一個 loading 狀態的頁面，然後在背景生成頁面，生成完成後再更新頁面內容。

[Example](/data-fetching/apple)

## 表單操作

### 表單處理方式

- 在 Page Router 架構中，表單多半由 **Client Side Rendering (CSR)** 處理。
- 這是因為表單需要即時回應使用者輸入、顯示狀態或錯誤訊息。
- 透過 React 的狀態管理 (`useState`) 與事件監聽 (`onSubmit`)，可讓整個流程流暢且互動性高。

### 表單送出流程

1. 使用者輸入資料
2. onSubmit 攔截表單送出 (event.preventDefault())
3. 將表單內容轉為物件並以 fetch() 送至 /api/submit
4. API Route 在伺服器端接收、處理、回傳 JSON
5. 前端更新畫面並顯示結果（例如：提交後的 ID）

### 範例

```tsx
import { FormEvent, useState } from "react";

export default function Page() {
  const [id, setId] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    // Handle response if necessary
    const data = await response.json();
    console.log("Response from server:", data);
    setId(data.id);
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
      {id && <div>Submitted ID: {id}</div>}
    </form>
  );
}
```

```ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.body;
  console.log("req.body", req.body);
  console.log("Received Name:", name);
  const id = Math.random().toString(36).substring(2, 15);
  res.status(200).json({ id, name });
}
```

[Example](/submit-form)
