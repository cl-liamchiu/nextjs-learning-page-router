---
title: "Next.js Page Router 筆記"
date: "2025-09-30"
summary: "整理 Page Router 的核心概念、檔案結構。"
tags: ["Next.js", "Routing", "Page Router"]
---

# Next.js Page Router（/pages）完整筆記

> 本筆記整理 **Next.js Page Router**（以 /pages 目錄為核心的路由系統）。

---

## 1) 核心觀念

- 以 **檔案＝路由** 的方式：放在 `/pages` 資料夾下的檔案或資料夾，會自動轉換成對應路徑。

  - `/pages/about.tsx` → `/about`

- **Index routes**：如果一個 folder 下有 index 檔案，會自動作為該 folder 對應的 page。
  - `/pages/about/index.tsx` → `/about`
- **Nested routes**：
  - `/pages/blog/hello-world.tsx` → `/blog/hello-world`
- **Dynamic Routes**：
  - `/pages/posts/[id].tsx` → `/posts/123`（`{ slug: '123' }`）
  - **Catch‑all**：
    - `/pages/docs/[...slug].tsx` → `/docs/a/b/c`（`{ slug: ['a', 'b', 'c'] }`）
  - **Optional catch‑all**：
    - `/pages/docs/[[...slug]].tsx`（`/docs` 與子路徑都匹配，`/docs` -> `{ slug: undefined }`）
    - 不能與 index、catch-all 同時存在。
- 特殊檔案：
  - `_app.tsx`：包住所有頁面（global layout、狀態、樣式）
  - `_document.tsx`：自訂 HTML 結構（<html>、<body>）
  - `404.tsx`、`500.tsx`、`_error.tsx`：錯誤頁
  - `/pages/api/*`：API Routes（伺服器端）

---

## 2) 基本檔案結構

```txt
nextjs-learning/
├─ src/                            →  主要程式碼
│   ├─ pages/                      →  頁面
│   │  ├─ index.tsx                →  /
│   │  ├─ about.tsx                →  /about
│   │  ├─ blog/
│   │  │  ├─ index.tsx             →  /blog
│   │  │  ├─ hello-world.tsx       →  /blog/hello-world
│   │  │  ├─ [slug].tsx            →  /blog/123、/blog/hello-world1
│   │  │  └─ [...segments].tsx     →  /blog/a/b/c
│   │  ├─ docs/
│   │  │  ├─ hello-world.tsx       →  /blog/hello-world
│   │  │  └─ [[...slug]].tsx       →  /docs, /docs/a, /docs/a/b
│   │  ├─ api/
│   │  │  └─ hello.ts              →  /api/hello
│   │  ├─ 404.tsx                  →  自訂 404
│   │  └─ _app.tsx                 →  全域 App 容器
│   ├─ styles/                     →  全域＆模組化樣式
│   ├─ compnents/                  →  純 React UI 元件。
│   └─ lib/                        →  共享的工具程式、hook、API 呼叫。
├─ public/                         →  靜態資產（/favicon.ico、/images/*）
├─ next.config.js                  →  設定（rewrites/redirects/headers 等）
└─ tsconfig.json
```

[blog](blog/)、[blog/hello-world](blog/hello-world)、[blog/[slug]](blog/123)、[blog/[...segments]](blog/a/b/c)、[docs/hello-world](docs/hello-world)、[docs/[[...slug]]](docs/)、[api/hello](api/hello)

## 3) Layout

在 React 中，可以透過 `props.children` 來實現**組合模式（Composition Pattern）**。
這種方式允許我們將其他 component 或 JSX 元素，直接作為子內容傳入，並插入到父 component 的指定位置。

例如：

```tsx
// layout.tsx
import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// dashboard.tsx
import Layout from "../components/layout";

export default function Dashboard() {
  return (
    <Layout>
      <div>This is Dashboard</div>
    </Layout>
  );
}
```

在這個例子中，`<Layout>` 會將傳入的 `<div>This is Dashboard</div>`
插入到 `{children}` 的位置，因此最後渲染結果等同於：

```tsx
<>
  <Navbar />
  <main>
    <div>This is Dashboard</div>
  </main>
  <Footer />
</>
```

而如果想要設計一個**全域共用的 Layout**，讓「所有」頁面自動套用，就需要在 `_app.tsx` 中設定：

```tsx
// 原本的 _app.tsx
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// 改成使用 Layout 包裹
import Layout from "../components/layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

有時候，我們不希望所有頁面都用相同的 Layout，而是**每個頁面自己決定 Layout**。
這時可以在頁面 component 上定義一個靜態方法 `getLayout`，回傳要如何套用 Layout：

```tsx
// pages/index.tsx
import Layout from "../components/layout";
import NestedLayout from "../components/nested-layout";

export default function Page() {
  return <p>Your content</p>;
}

// 在頁面層級定義 getLayout
Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  );
};
```

然後在 `_app.tsx` 中判斷該頁面有沒有 `getLayout`，有的話就使用它：

```tsx
// pages/_app.tsx
export default function MyApp({ Component, pageProps }) {
  // 如果該頁面定義了 getLayout，就用它，否則直接渲染頁面
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
}
```

而在 `_app.tsx` 中還可以做其他邏輯判斷來套用對應的 layout。

---

## 4) Dynamic Routes

剛剛有介紹 Dynamic Routes 檔案的命名，以及對應的網址。
而跟 React 一樣，我們可以在頁面中取得網址中動態的參數，用該參數來動態決定頁面的資料。

```tsx
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  return <p>Dynamic Page: {router.query.slug}</p>;
}
```

而不同種類的動態路由，取到的參數會是不同的。

- `[slug]`:
  - `/blog/a` -> `{ slug: 'a' }`
- `[...slug]`:
  - `/blog/a` -> `{ slug: ['a'] }`
  - `/blog/a/b` -> `{ slug: ['a','b'] }`
- `[[...slug]]`:
  - `/blog` -> `{ slug: undefined }`
  - `/blog/a` -> `{ slug: ['a'] }`
  - `/blog/a/b` -> `{ slug: ['a','b'] }`

## 5) Linking and Navigating

NextJS 的導航也是用 SPA 方式切換。提供 `Link` 來切換頁面。用法如下：

```tsx
import Link from "next/link";

function Home() {
  return (
    <ul>
      <li>
        <Link href="/home">Home</Link>
      </li>
      <li>
        <Link href="/about">About Us</Link>
      </li>
      <li>
        <Link href="/blog/hello-world">Blog Post</Link>
      </li>
      <li>
        <Link
          href={{
            pathname: "/blog/[slug]",
            query: { slug: "hello-world" },
          }}
        >
          Blog Post
        </Link>
      </li>
    </ul>
  );
}

export default Home;
```

[Home](home)

如果希望路徑是動態的話，可以使用：

```tsx
<Link
href={`/blog/${post.slug}`}>
{post.title}
</Link>

//或者
<Link
href={{
    pathname: '/blog/[slug]',
    query: { slug: post.slug },
}}
>
{post.title}
</Link>
```

如果希望導航這件事是在 function 裡面主動執行，可以使用 `router.push`。

```tsx
import { useRouter } from "next/router";

export default function ReadMore() {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/about")}>
      Click here to read more
    </button>
  );
}
```

## 5) 理解 `_app.tsx`

```tsx
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### 1. `Component`

- 在 \_app.tsx 裡，Next.js 會自動傳入一個 Component prop。
- 它就是 當前正在顯示的頁面。
  - 你在 /about → Component = pages/about.tsx
  - 你在 /blog/123 → Component = pages/blog/[id].tsx

### 2. `pageProps`

- pageProps 是 Next.js 幫你準備的 初始資料。
- 它的內容來自於該頁面是否有用到資料抓取函數：
  - 如果頁面有 getStaticProps → return 的 props 會放進 pageProps
  - 如果頁面有 getServerSideProps → return 的 props 也會放進 pageProps
  - 如果頁面沒有任何資料抓取 → pageProps = {}（空物件）

### 3. 假設有一個頁面 /pages/blog/[id].tsx：

```tsx
// pages/blog/[id].tsx
export default function BlogPost({ post }) {
  return <h1>{post.title}</h1>;
}

export async function getServerSideProps(context) {
  const post = await fetch(
    `https://api.example.com/posts/${context.params.id}`
  ).then((r) => r.json());
  return { props: { post } };
}
```

在 `_app.tsx`：

```tsx
export default function MyApp({ Component, pageProps }) {
  // 這裡的 Component = BlogPost
  // 這裡的 pageProps = { post: {...} } （從 GSSP return 的 props）
  return <Component {...pageProps} />;
}

// 等價於
<BlogPost post={post} />;
```
