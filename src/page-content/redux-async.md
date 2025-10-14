---
title: Redux Async Logic and Data Fetching
date: "2025-10-09"
summary: 了解 Redux Middleware 的概念 及 Redux Async function 用法。
tags: [Redux, React, Next.js, TypeScript]
---

> 要使用 Async function，必須用 middleware 來處理非同步邏輯。

## 🎯 Middleware 是什麼？

Middleware 是一種介於 action 發送與 reducer 處理之間的函式，可以用來擴展 Redux 的功能，例如處理非同步請求、日誌紀錄、錯誤處理等。

### 🧩 一、為什麼需要 Middleware

Redux 的資料流是：

```
UI → dispatch(action) → reducer → 更新 state
```

但有時我們想在 action 傳到 reducer 前「插入自訂邏輯」，例如：

- 紀錄 log
- 執行非同步請求（API call）
- 攔截、延遲或修改 action
- 錯誤追蹤、副作用處理

這時就需要 **Middleware**。

Middleware 讓我們能「擴充 dispatch」的行為。

---

### ⚙️ 二、Middleware 的概念（與 Express 類比）

類似 Express / Koa 的 middleware：

```
Express: Request → middleware A → middleware B → Response
Redux:  action → middleware1 → middleware2 → reducer → state 更新
```

每個 middleware 都可以：

- 先觀察 action
- 做額外處理（logging、API call 等）
- 或用 `next(action)` 把 action 傳給下一個 middleware

---

### 🧩 三、Middleware 結構（三層函數）

Redux middleware 是三層巢狀函數：

```ts
const exampleMiddleware = (storeAPI) => (next) => (action) => {
  // 可在這裡做任何事，例如：console.log(action)
  return next(action); // 把 action 傳給下一個 middleware
};
```

| 層級   | 名稱            | 參數                                    | 說明                 |
| ------ | --------------- | --------------------------------------- | -------------------- |
| 第一層 | middleware 本體 | `storeAPI`（含 dispatch, getState）     | 初始化時執行         |
| 第二層 | wrapDispatch    | `next`（下一個 middleware 的 dispatch） | 控制是否繼續傳遞     |
| 第三層 | handleAction    | `action`                                | 每次 dispatch 時執行 |

---

### 🧠 四、使用方法

```ts
// exampleAddons/middleware.ts

export const print1 = (storeAPI) => (next) => (action) => {
  console.log("1");
  return next(action);
};

export const print2 = (storeAPI) => (next) => (action) => {
  console.log("2");
  return next(action);
};

export const print3 = (storeAPI) => (next) => (action) => {
  console.log("3");
  return next(action);
};
```

```ts
// store.ts
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer";
import { print1, print2, print3 } from "./exampleAddons/middleware";

const middlewareEnhancer = applyMiddleware(print1, print2, print3);
const store = createStore(rootReducer, middlewareEnhancer);

export default store;
```

如果 dispatch 一個 action：

```ts
import store from "./store";

store.dispatch({ type: "todos/todoAdded", payload: "Learn about actions" });
// log: '1'
// log: '2'
// log: '3'
```

會**依序**印出 `1`、`2`、`3`。

---

### 💡 五、常見範例

### 1️⃣ Logger Middleware

```ts
const loggerMiddleware = (storeAPI) => (next) => (action) => {
  console.log("dispatching", action);
  const result = next(action);
  console.log("next state", storeAPI.getState());
  return result;
};
```

輸出：action 與更新後的 state。

---

### 2️⃣ 修改回傳值

```js
const alwaysReturnHelloMiddleware = (storeAPI) => (next) => (action) => {
  next(action);
  return "Hello!";
};

store.dispatch({ type: "any/action" }); // → 'Hello!'
```

---

### 3️⃣ 延遲執行（模擬非同步邏輯）

```js
const delayedMessageMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === "todos/todoAdded") {
    setTimeout(() => {
      console.log("Added a new todo:", action.payload);
    }, 1000);
  }
  return next(action);
};
```

---

### 🚀 六、Middleware 常見用途

Middleware 通常用來處理「副作用 (Side Effects)」：

- ✅ 記錄 log、debug
- ✅ 錯誤追蹤與分析
- ✅ 延遲、排程任務
- ✅ 呼叫 API（如 `redux-thunk`）
- ✅ 攔截或修改 action
- ✅ 控制非同步資料流

---

## 🎯 Async Logic and Data Fetching

### 🔍 為什麼需要「非同步邏輯」？

剛剛學到的 Redux 資料流是「同步」的：

```
UI → dispatch(action) → reducer → 更新 state
```

但在真實應用中，常見任務像：

- 從伺服器 抓取資料 (fetch data)
- 發送 POST/PUT/DELETE 請求
- 根據回應顯示 loading / success / error 狀態
  這些都不是「立即」完成的 → 因此需要「非同步邏輯層 (async logic layer)」來協助。

### ⚙️ 用 Middleware 寫 Async Logic

一種方法是在 middleware 裡看到特定 action 時，執行非同步請求，然後再 dispatch 其他 action 來更新 state。

```ts
const fetchTodosMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type === "todos/fetchTodos") {
    // Make an API call to fetch todos from the server
    client.get("todos").then((todos) => {
      // Dispatch an action with the todos we received
      storeAPI.dispatch({ type: "todos/todosLoaded", payload: todos });
    });
  }

  return next(action);
};
```

但是這種方式有兩個問題：

1. 每一種 async 行為（fetch todos、fetch user...）都要各寫一個 middleware。→ 太多重複、太不彈性。
2. middleware 的邏輯太死：只能針對某個 action.type，不能通用。

💡 官方提出的想法：

- 原本 Redux 只允許 dispatch「純物件」的 action (`{ type: 'todos/todoAdded', payload: 'Learn Redux' }`)。
- 但如果我能夠 dispatch 一個函式 (function)，而不是一個普通的 action 物件呢？
- 🧩 所以他們要做的是「一個能辨識 function 的 middleware」

```ts
const asyncFunctionMiddleware = (storeAPI) => (next) => (action) => {
  // If the "action" is actually a function instead...
  if (typeof action === "function") {
    // then call the function and pass `dispatch` and `getState` as arguments
    return action(storeAPI.dispatch, storeAPI.getState);
  }

  // Otherwise, it's a normal action - send it onwards
  return next(action);
};
```

這樣就能 dispatch 一個「async function」，參數是 `dispatch` 和 `getState`：

```ts
const middlewareEnhancer = applyMiddleware(asyncFunctionMiddleware);
const store = createStore(rootReducer, middlewareEnhancer);

// Write a function that has `dispatch` and `getState` as arguments
const fetchSomeData = async (dispatch, getState) => {
  // Make an async HTTP request
  const todos = await client.get("todos");
  // Dispatch an action with the todos we received
  dispatch({ type: "todos/todosLoaded", payload: todos });
  // Check the updated store state after dispatching
  const allTodos = getState().todos;
  console.log("Number of todos after loading: ", allTodos.length);
};

// Pass the _function_ we wrote to `dispatch`
store.dispatch(fetchSomeData);
// logs: 'Number of todos after loading: ###'
```

而 Redux 官方已經幫我們把這個 middleware 寫好，
就是 Redux Thunk Middleware (NPM 套件 `redux-thunk`)。

註：“Thunk” 是程式語言裡的一個術語，指「執行一些延遲工作的程式碼」(a piece of code that does some delayed work)。

### 🛠️ 實作範例：Fetch Products

### 1️⃣ Async Function: Fetch Products from API

```ts
// store/products-reducer.ts
const fetchProducts = async (dispatch, getState) => {
  dispatch({ type: "products/fetchProducts/pending" });
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    dispatch({
      type: "products/fetchProducts/fulfilled",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "products/fetchProducts/rejected",
      payload: error.message,
    });
  }
};

export { fetchProducts };
```

### 2️⃣ Reducer: Handle Loading, Success, Error States

```ts
// store/products-reducer.ts
const initialState = { items: [], loading: false, error: null };

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "products/fetchProducts/pending":
      return { ...state, loading: true, error: null };
    case "products/fetchProducts/fulfilled":
      return { ...state, loading: false, items: action.payload };
    case "products/fetchProducts/rejected":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default productsReducer;
```

### 3️⃣ Configuring the Store

```tsx
import { thunk } from "redux-thunk";
import productsReducer from "./products-reducer";
import cartReducer from "./cart-reducer";
import todosReducer from "./todos-reducer";

const allReducer = combineReducers({
  todos: todosReducer,
  cart: cartReducer,
  products: productsReducer,
});

const middlewareEnhancer = applyMiddleware(thunk);
export const store = createStore(allReducer, middlewareEnhancer);
```

### 4️⃣ Using in a React Component

```tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/products-reducer";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    dispatch(fetchProducts);
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
};
```
