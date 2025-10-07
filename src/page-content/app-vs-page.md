---

title: Next.js Pages Router vs App Router（速查筆記）
date: "2025-10-07"
summary: 梳理 Next.js 兩套路由架構的概念、檔案結構、資料抓取、渲染模式、SEO/快取與常見情境選型。
tags: ["Next.js","Routing","Pages Router","App Router","SSR","SSG","ISR","RSC","Server Actions"]
------------------------------------------------------------------------------------------------

# 🧭 概觀

Next.js 目前有兩套路由架構：

* **Pages Router**（`/pages`）：傳統、成熟，使用 `getStaticProps/getServerSideProps` 與 API Routes。
* **App Router**（`/app`）：以 **React Server Components** 與 **Layout-first** 設計為核心，支援 **Server Actions**、**Streaming**、**Nested/Parallel/Intercepting Routes** 等新特性。

---

# 🗂️ 檔案結構與命名

| 主題          | Pages Router                                   | App Router                                                       |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| 目錄          | `./pages`                                      | `./app`                                                          |
| 基本頁面      | `pages/index.tsx`, `pages/about.tsx`           | `app/page.tsx`, `app/about/page.tsx`                             |
| 布局          | `_app.tsx`（全局）+ `_document.tsx`（HTML 殼） | `layout.tsx`（可巢狀、區域化）+ `template.tsx`（每次重新 mount） |
| 動態路由      | `pages/posts/[id].tsx`、`[...slug].tsx`        | `app/posts/[id]/page.tsx`、`[...slug]/page.tsx`                  |
| API           | `pages/api/*.ts`                               | `app/api/route.ts` 或 `app/**/route.ts`（Route Handlers）        |
| 錯誤/載入狀態 | 自行處理（或 Error Boundary）                  | `error.tsx`、`loading.tsx`（區域化）                             |
| 中介層        | `middleware.ts`（相同）                        | `middleware.ts`（相同）                                          |
| 靜態資源      | `public/`（相同）                              | `public/`（相同）                                                |

---

# ⚙️ 資料抓取與渲染模型

## Pages Router（函式式資料抓取）

- **SSG**：`getStaticProps`
- **SSR**：`getServerSideProps`
- **ISR**：`getStaticProps` + `revalidate`
- **CSR**：元件內 `useEffect` 或第三方（SWR、React Query）

```tsx
// pages/blog/[slug].tsx
export const getStaticProps = async (ctx) => {
  const post = await fetchCMS(ctx.params.slug);
  return { props: { post }, revalidate: 60 }; // ISR
};
```

## App Router（RSC 與快取語意）

- **Server Components（預設）** 在伺服器執行，可直接 `await` 資料。
- `fetch()` 內建快取與 **revalidate** 語意（或使用 `cache()`）。
- **Server Actions** 可直接處理表單/動作（預設在伺服器跑）。
- 支援 **Streaming** 與 **部分區塊** `loading.tsx`。

```tsx
// app/blog/[slug]/page.tsx (Server Component)
export default async function Page({ params }) {
  const res = await fetch(`https://cms/api/${params.slug}`, {
    next: { revalidate: 60 },
  });
  const post = await res.json();
  return <Article post={post} />;
}
```

---

# 📨 表單與 Mutations

| 需求     | Pages Router           | App Router                                            |
| -------- | ---------------------- | ----------------------------------------------------- |
| 表單提交 | 送到 `pages/api/*`     | **Server Actions**（建議）或 `route.ts`               |
| 實作方式 | `fetch('/api/submit')` | `<form action={myAction}>`（Action 直接是伺服器函式） |

```tsx
// app/contact/page.tsx
"use client";
import { experimental_useFormStatus as useFormStatus } from "react-dom"; // 視版本而定

export default function Contact() {
  async function send(formData: FormData) {
    "use server";
    // 伺服器執行：存 DB、呼叫外部 API...
  }
  const { pending } = useFormStatus();
  return (
    <form action={send}>
      <input name="email" />
      <button disabled={pending}>Send</button>
    </form>
  );
}
```

> **重點**：App Router 的 Server Actions 省去自建 API 一層，權限/驗證可在同一位置實作；但若要給第三方客戶端使用，仍需 Route Handler/外部 API。

---

# 🧩 元件邊界與用法

- **App Router**：

  - 預設 **Server Component**。
  - 需要瀏覽器 API/互動時於檔案頂部加上 **`"use client"`**。
  - 以**布局為中心**：`layout.tsx` 可巢狀組合、共用資料、避免重複抓取。
  - 支援 **Parallel Routes**、**Intercepting Routes**，可組合多區塊內容或覆蓋路由片段。

- **Pages Router**：

  - 全部是 **Client Components**（傳統 React），SSR/SSG 僅在初始 HTML 輸出階段。
