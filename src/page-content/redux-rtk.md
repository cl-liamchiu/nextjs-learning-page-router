---
title: 傳統 Redux vs Redux Toolkit (RTK) 對照筆記
date: "2025-10-14"
summary: 系統性整理傳統 Redux 與 RTK 的差異與對照範例，涵蓋 store、reducer/slice、非同步邏輯、RTK Query。
tags: [Redux, RTK, React, State Management]
---

# ⚖️ 傳統 Redux vs Redux Toolkit (RTK)

Redux Toolkit（RTK）是 Redux 官方推薦的「現代標準寫法」。
它封裝了原本冗長的樣板程式（boilerplate），讓開發更直覺、可維護。

---

## 🧩 一、Store 建立與 Middleware 設定

| 項目            | 傳統 Redux                            | RTK                                             |
| --------------- | ------------------------------------- | ----------------------------------------------- |
| 建立方式        | `createStore()` + `applyMiddleware()` | `configureStore()`                              |
| DevTools        | 需手動接入                            | 內建支援                                        |
| Middleware      | 需自行指定（thunk、logger）           | 內建 thunk / serializableCheck / immutableCheck |
| combineReducers | 需明確呼叫                            | 可直接在 reducer 屬性中定義物件                 |

### 📘 範例比較

#### 傳統 Redux

```js
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import productsReducer from "./products-reducer";
import cartReducer from "./cart-slice";
import todosReducer from "./todos-reducer";

const allReducer = combineReducers({
  todos: todosReducer,
  cart: cartReducer,
  products: productsReducer,
});

const middlewareEnhancer = applyMiddleware(thunk, logger); // 可加入多個 middleware
const composedEnhancer = composeWithDevTools({
  trace: true, // 開啟 Trace
  traceLimit: 25, // 最多顯示 25 層 stack
})(middlewareEnhancer);

export const store = createStore(allReducer, composedEnhancer);
```

#### RTK 寫法

```js
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./products-reducer";
import cartReducer from "./cart-slice";
import todosReducer from "./todos-reducer";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 自帶 thunk，用 concat 加入其他 middleware
  devTools: { trace: true, traceLimit: 25 }, // 可自訂 DevTools 選項
});
```

---

## 🧠 二、Reducer 與 Slice 寫法

| 項目            | 傳統 Redux                 | RTK                                    |
| --------------- | -------------------------- | -------------------------------------- |
| Reducer 寫法    | `switch(action.type)`      | `createSlice({ reducers })`            |
| Action Type     | 手動定義字串常數           | 自動生成 type                          |
| Action Creator  | 手動撰寫                   | `slice.actions` 自動生成               |
| State 更新方式  | 必須回傳新物件 (immutable) | 可直接修改 state，RTK 底層用 **Immer** |
| combineReducers | 需手動整合                 | `configureStore` 自動整合多 slice      |

### 📘 範例比較

#### 傳統 Redux

```js
// actions.js
export const INCREMENT = "INCREMENT";
export const increment = () => ({ type: INCREMENT });

// reducer.js
const initial = { value: 0 };

export function counter(state = initial, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    default:
      return state;
  }
}
```

#### RTK 寫法

```js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment(state) {
      state.value += 1; // 可直接改，Immer 會自動產生新 state
    },
  },
});

export const { increment } = counterSlice.actions;
export const counterReducer = counterSlice.reducer;
```

---

### 🧩 多個 Reducer 組合

#### 傳統 Redux

```js
import { combineReducers } from "redux";
import { counter } from "./counter";
import { user } from "./user";

export const rootReducer = combineReducers({ counter, user });
```

#### RTK 寫法

```js
import counterReducer from "./counterSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});
```

---

## 🔁 三、非同步邏輯

| 項目          | 傳統 Redux                                     | RTK                             |
| ------------- | ---------------------------------------------- | ------------------------------- |
| thunk 支援    | 需安裝 `redux-thunk`                           | 內建                            |
| 非同步 action | 手動派發三種 action（pending/success/failure） | `createAsyncThunk` 自動生成三態 |
| 型別支援      | 需手動撰寫                                     | 內建泛型 / `PayloadAction<T>`   |

---

### createAsyncThunk 範例

#### 傳統 Redux

```js
export const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: "user/fetch/pending" });
  try {
    const data = await fetch(`/api/users/${id}`).then((r) => r.json());
    dispatch({ type: "user/fetch/fulfilled", payload: data });
  } catch (err) {
    dispatch({ type: "user/fetch/rejected", error: String(err) });
  }
};
```

#### RTK 寫法

```js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/fetch", async (id) => {
  const res = await fetch(`/api/users/${id}`);
  return await res.json();
});

const userSlice = createSlice({
  name: "user",
  initialState: { entity: null, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.entity = a.payload;
      })
      .addCase(fetchUser.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      });
  },
});
```

註：還有 RTK Query 可以更進一步簡化 API 資料抓取與快取。

## 💡 四、類型支援（TypeScript）

傳統：大量手寫型別、容易漏寫

RTK：PayloadAction<T>、configureStore 自動推導 RootState/AppDispatch，型別體驗好很多

---

## 🧾 小結：RTK 帶來的改進

| 面向       | 傳統 Redux          | Redux Toolkit               |
| ---------- | ------------------- | --------------------------- |
| 樣板代碼   | 多                  | 少                          |
| 非同步處理 | 手動定義多組 action | `createAsyncThunk` 自動產生 |
| 可讀性     | 高度分散            | 高度模組化（slice 為中心）  |
| 型別支援   | 難維護              | 完整泛型支援                |
| DevTools   | 手動設定            | 內建啟用                    |
| Middleware | 需明確指定          | 內建 + 自訂簡單             |
| 資料抓取   | 無標準解            | RTK Query 自動處理          |

---

### ✅ 遷移 Checklist

1. `createStore` → `configureStore`
2. `switch...case` → `createSlice`
3. `combineReducers` → `configureStore({ reducer: {...} })`
4. `redux-thunk` → 內建，或使用 `createAsyncThunk`
5. 可考慮導入 **RTK Query** 管理 API 狀態
6. 建立 typed hooks：`useAppDispatch`、`useAppSelector`

---

> 💡 **結論：**
> Redux Toolkit 並非「新版本」，而是 Redux 官方的「現代標準」。
> 所有新專案、文件、範例、教學，皆以 RTK 為主流架構。
