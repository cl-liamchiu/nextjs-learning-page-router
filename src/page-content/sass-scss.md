---
title: Sass vs SCSS 筆記
date: "2025-10-13"
summary: 說明 Sass 與 SCSS 的歷史、差別與演變，理解為何 SCSS 成為主流語法。
tags: [Sass, SCSS, CSS, Frontend]
---

## 🧩 一、Sass 與 SCSS 是什麼？

- **Sass (Syntactically Awesome StyleSheets)** 是一種 CSS 預處理語言。
- 透過變數、巢狀（nesting）、mixin、extend 等功能，讓 CSS 更有結構性與可重用性。
- **Sass 與 SCSS 是同一語言的兩種語法格式**：

  - `.sass`：舊版、縮排式語法
  - `.scss`：新版、與 CSS 相容的語法

---

## 🕰️ 二、演進歷史

| 時間        | 語言                                     | 特點與說明                                                                                                                   |
| ----------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **2006 年** | **Sass (.sass)**                         | 由 Ruby 工程師設計，最早版本用縮排取代 `{}` 與 `;`，語法簡潔但與 CSS 差異大。最初實作於 Ruby 生態，語法受 Ruby / Haml 影響。 |
| **2010 年** | **SCSS (.scss)**                         | Sass 3.0 推出新版語法，全名 **Sassy CSS**。完全相容 CSS，只是多了 Sass 功能，旨在縮短與 CSS 的語法鴻溝。                     |
| **現在**    | **Sass = 語言名稱，SCSS = 主流語法格式** | 當大家說「用 Sass」時，其實指的是「用 SCSS 寫 Sass」。                                                                       |

📖 根據官方與社群資料：

- Sass 最初於 2006 年 11 月由 Hampton Catlin 發表。
- SCSS 語法於 2010 年隨 Sass v3.0 引入，主要為了與 CSS 完全兼容。

---

## 🧱 三、語法比較

### 🔹 Sass (.sass)

```sass
body
  background: #000
  color: white

  h1
    font-size: 2rem
```

### 🔹 SCSS (.scss)

```scss
body {
  background: #000;
  color: white;

  h1 {
    font-size: 2rem;
  }
}
```

### 🔍 編譯後的 CSS

```css
body {
  background: #000;
  color: white;
}
body h1 {
  font-size: 2rem;
}
```

---

## 🧠 四、語法細節差異

| 特性            | **Sass (.sass)**  | **SCSS (.scss)**       | 備註                           |
| --------------- | ----------------- | ---------------------- | ------------------------------ |
| 語法風格        | 類 Ruby（縮排式） | 類 CSS（有 `{}`、`;`） | Sass 最初受 Ruby/Haml 語法影響 |
| 分號與大括號    | ❌ 不使用         | ✅ 使用                | SCSS 與 CSS 完全相容           |
| 縮排            | 嚴格縮排代表層級  | 用 `{}` 控制層級       |                                |
| 屬性 assignment | `=`               | `:`                    | Sass 使用 Ruby 式 assignment   |
| mixin 定義      | `=`               | `@mixin`               | 功能相同，語法不同             |
| mixin 引用      | `+`               | `@include`             | 同樣實現重複使用樣式           |
| 巢狀（nesting） | ✅ 用縮排表示層級 | ✅ 用 `{}` 表示層級    | 功能完全等價                   |
| 相容性          | ❌ 不相容 CSS     | ✅ 完全相容 CSS        | SCSS 最大優勢之一              |

### 範例：mixin 定義與引用

#### Sass 語法

```sass
=button-style($color)
  background: $color
  color: white

.btn
  +button-style(#3498db)
```

#### SCSS 語法

```scss
@mixin button-style($color) {
  background: $color;
  color: white;
}

.btn {
  @include button-style(#3498db);
}
```

---

## 🧠 五、為何從 Sass 轉向 SCSS？

| 原因           | 說明                                                  |
| -------------- | ----------------------------------------------------- |
| 太簡潔反而難用 | 舊版 Sass 拿掉 `{}` 與 `;`，雖然短，但和 CSS 差太多。 |
| 容易出錯       | 縮排錯一格就報錯，不直覺。                            |
| 開發者習慣     | 大部分人已熟悉 CSS 語法，不想重新學。                 |
| 解決方案       | 團隊推出 SCSS，語法與 CSS 幾乎相同，學習成本低。      |

---

## ⚙️ 六、現況與建議

- ✅ **新專案請用 SCSS**：主流、支援度高、可直接套用現有 CSS。
- `.sass` 仍可用，但主要出現在舊專案中。
- 所以：

  > **CSS → Sass（加功能）→ SCSS（語法相容的 Sass）**

---

## 📚 七、小結對照表

| 比較項目 | Sass (.sass)     | SCSS (.scss)           |
| -------- | ---------------- | ---------------------- |
| 語法風格 | 縮排式           | 類 CSS（含 `{}`、`;`） |
| 相容性   | 不能直接用 CSS   | ✅ 完全相容 CSS        |
| 可讀性   | 精簡但敏感       | 類似 CSS，容易上手     |
| 巢狀寫法 | 用縮排表示層級   | 用 `{}` 表示層級       |
| 主流度   | 舊語法，逐漸淘汰 | ✅ 現今主流            |

---

💡 **一句話總結：**

> Sass 是語言，SCSS 是語法。
> 現代開發幾乎都用 SCSS 來撰寫 Sass。
