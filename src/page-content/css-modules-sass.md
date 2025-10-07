---
title: CSS Modules vs Sass 筆記
date: "2025-10-02"
summary: 本筆記整理了 CSS Modules 與 Sass 在 React/Next.js 專案中的差異、使用方式與建議情境，方便快速查閱。
tags: ["CSS", "Sass", "Next.js", "React", "Styling"]
---

# CSS Modules vs Sass 筆記

本筆記整理了 **CSS Modules** 與 **Sass** 在 React/Next.js 專案中的差異、使用方式與建議情境，方便快速查閱。

## 1. CSS Modules

### 概念

- **作用範圍**：自動將 class 名稱 local scope 化，避免命名衝突。
- **檔案命名**：`<name>.module.css`
- **使用方式**：

  ```css
  .blog {
    padding: 24px;
  }
  ```

  ```tsx
  import styles from "./blog.module.css";

  export default function Page() {
    return <main className={styles.blog}></main>;
  }
  ```

- **注意事項**：在 CSS Modules 中，強烈推薦只使用 Class 選擇器。

### 優點

- 避免全域命名污染。
- TypeScript 可以檢查 key 存不存在。
- 適合 **component-level styling**。

---

## 2. Sass (SCSS)

### 概念

- 一種 **CSS 預處理器**，需編譯成純 CSS 才能使用。
- 支援變數、巢狀、mixin、extend 等功能。
- 檔案命名：`<name>.scss` 或 `<name>.sass`

### 常見語法

- **變數**

  ```scss
  $primary: #4caf50;

  .btn {
    background: $primary;
  }
  ```

  編譯後：

  ```css
  button {
    background: #4caf50;
  }
  ```

- **巢狀**

  ```scss
  .navbar {
    background: #333;
    .nav-item {
      color: white;
    }
  }
  ```

  編譯後：

  ```css
  .navbar {
    background: #333;
  }
  .navbar .nav-item {
    color: white;
  }
  ```

- **Mixin / Include**

  ```scss
  @mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card {
    @include flex-center;
    border: 1px solid #ddd;
  }
  ```

  編譯後：

  ```css
  .card {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #ddd;
  }
  ```

- **Extend**

  ```scss
  .message {
    padding: 10px;
  }
  .success {
    @extend .message;
    color: green;
  }
  .error {
    @extend .message;
    color: red;
  }
  ```

  編譯後：

  ```css
  .message,
  .success,
  .error {
    padding: 10px;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }
  ```

### 優點

- 程式化能力強，適合大型專案。
- 可以更高效率地維護與重用樣式。
