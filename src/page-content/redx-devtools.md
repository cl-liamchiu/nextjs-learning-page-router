---
title: Redux DevTools 使用筆記
date: "2025-10-13"
summary: Redux DevTools 的安裝、設定、介面說明與進階功能（含 trace、Test 分頁、自動測試模板）完整整理。
tags: [Redux, DevTools, Debug, RTK, Frontend]
---

## 🧩 一、什麼是 Redux DevTools

Redux DevTools 是用來觀察與除錯 Redux 狀態流的開發者工具。可追蹤 action、檢視 state 變化、回放狀態（Time Travel）、模擬 dispatch 與生成測試模板。

## ⚙️ 二、安裝與設定

### 1️⃣ 安裝瀏覽器擴充

- Chrome / Edge: [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- 安裝後，開啟 DevTools 會多出一個 **Redux** 或 **State** 分頁。

### 2️⃣ Redux Toolkit (RTK) 內建支援

RTK 的 `configureStore` 已自動整合 DevTools。

```ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";

export const store = configureStore({
  reducer: { counter: counterReducer },
  devTools: { trace: true, traceLimit: 25 }, // 可自訂 trace
});
```

### 3️⃣ 傳統 Redux（非 RTK）

RTK 以前的寫法需手動接 DevTools enhancer。

`redux-devtools-extension` 比較舊的套件。

`@redux-devtools/extension` 是新版官方推薦。

```js
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const composedEnhancer = composeWithDevTools({
  trace: true, // 開啟 Trace
  traceLimit: 25, // 最多顯示 25 層 stack
})(applyMiddleware(thunk));

const store = createStore(rootReducer, composedEnhancer);
```

> `legacy_createStore` 是 Redux 5 後保留的舊版 API，RTK 已取代它的用途。

安裝設定好後，開啟瀏覽器，就可以使用 Redux DevTools Extension。

## 🧭 三、介面介紹

![Redux DevTools Screenshot](/redux_devtools_screenshot.png)

### 左側：Action 列表

- 顯示每次 `dispatch()` 的 action log。
- 點選某個 action → 右側顯示詳細資訊。
- 可使用 filter 搜尋 action 名稱。

### 右側：State / Action / Diff / Trace / Test 分頁

| 分頁       | 功能                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------- |
| **State**  | 顯示目前全域 store 狀態，可用 Tree / Chart / Raw 三種模式檢視。                             |
| **Action** | 顯示該次 dispatch 的 action type 與 payload。                                               |
| **Diff**   | 顯示前後狀態差異，方便確認 reducer 是否正確改動。                                           |
| **Trace**  | 需要開啟 `trace:true` 才會出現，顯示呼叫堆疊（哪個 component / middleware 觸發 dispatch）。 |
| **Test**   | 自動生成 Jest/Mocha 等格式的 reducer 測試模板，方便複製貼回專案。                           |

### 上方控制列

| 按鈕                      | 功能                         |
| ------------------------- | ---------------------------- |
| 🔴 **Reset**              | 清空 action 記錄並回初始狀態 |
| 🔁 **Revert**             | 回到選定 action 之前的狀態   |
| 🧹 **Sweep**              | 移除被 skip 的 action        |
| 💾 **Commit**             | 將當前狀態設為新的初始點     |
| ▶️ / ⏪ **Play / Rewind** | 用於 Time Travel Debugging   |
| **1x / 2x**               | 控制回放速度                 |

### 下方工具列

| 模式            | 說明                                 |
| --------------- | ------------------------------------ |
| **Inspector**   | 預設的檢查模式（state + action）     |
| **Log Monitor** | 類似 console.log 的紀錄列表          |
| **Chart**       | 視覺化 action → reducer → state 流程 |
| **RTK Query**   | 查看 RTK Query 的快取與請求狀態      |
