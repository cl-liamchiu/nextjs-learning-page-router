---
title: Redux 學習筆記
date: "2025-10-08"
summary: Redux 核心概念。
tags: [Redux, React, Next.js, TypeScript]
---

## 🎯 為什麼需要 Redux？

當應用規模變大時，React 原生的 state 管理方式容易變得複雜與難以維護，下列是常見的痛點與挑戰。

在 React 應用一開始很小的時候，資料流非常簡單：

```tsx
function App() {
  const [todos, setTodos] = React.useState(["吃早餐", "寫程式"]);

  function addTodo(newItem: string) {
    setTodos([...todos, newItem]);
  }

  return (
    <div>
      <TodoList items={todos} />
      <AddTodo onAdd={addTodo} />
    </div>
  );
}
```

父層 `App` 用 `useState` 管資料，再把資料傳給子元件就好。

但當應用變大，就會遇到以下幾個問題 👇

### 1️⃣ Prop Drilling（層層傳遞 Props）

- **問題**：父層要將資料傳到深層子元件，必須一層層傳遞 props。
- **結果**：程式難以維護、可讀性差。
- **例子**：

  ```
  function App() {
    const [theme, setTheme] = useState("light");
    return <Layout theme={theme} />;
  }

  function Layout({ theme }) {
    return <Sidebar theme={theme} />;
  }

  function Sidebar({ theme }) {
    return <Button theme={theme}>Click</Button>;
  }
  ```

  在這個例子中，`theme` 必須從 `App` 層層傳遞到 `Button`，若結構更深就會變得難以維護。

### 2️⃣ State 分散管理困難

- 各個元件都有自己的 useState，彼此之間**狀態不同步**。
- 例如：購物車頁與商品頁的數據不同步。

  ```tsx
  function ProductList() {
    const [cart, setCart] = useState([]);
    ...
  }

  function Cart() {
    const [cart, setCart] = useState([]);
    ...
  }
  ```

  在 React 裡，每個元件都可以自己有一份 state，但這兩份是獨立的，兩邊無共享同樣的狀態。

  - 解法 1:  把 state 提升（lift up）到它們的共同父元件。-> Prop Drilling
  - 解法 2: 用 Context 傳遞資料 -> 有他自己的問題

    - 🧩 問題 1：Context 太多時變成「巢狀地獄」

      ```tsx
      <UserContext.Provider value={user}>
        <ThemeContext.Provider value={theme}>
          <CartContext.Provider value={cart}>
            <TodoContext.Provider value={todos}>
              <App />
            </TodoContext.Provider>
          </CartContext.Provider>
        </ThemeContext.Provider>
      </UserContext.Provider>
      ```

      - 每個 context 都要自己寫一份 `Provider`、`useContext`、state 邏輯
      - 一改結構或多一個 context，要重構整個架構

    - 🧩 問題 2：誰都能改 state，缺乏「修改規範」

      - 任何拿到 `setState`  的元件，都能亂改購物車內容。
      - 沒有「誰、什麼時候、為什麼」的記錄。
      - 想追 bug → 超難找。

    - 🧩 問題 3：Context 會造成整個子樹重新 render
      - React 的 Context 有個隱藏成本，只要 Context 的 value 改變，所有被 provider 包住的子元件都會重新 render。

### 3️⃣ Debug 困難

- React 的核心任務是「給定狀態 → 產生畫面」，所以並不會知道狀態是如何變化的，而當狀態變化分散在各個元件中，就會變得**難以追蹤 state 改變的來源**。

## 🧩 Redux 解決的方法

把 state 抽取出來統一管理，讓任何 component 都可以接觸，但需要根據規則才能修改 state。

| 問題               | Redux 解法                                       |
| ------------------ | ------------------------------------------------ |
| Props 傳遞層層繁瑣 | 使用全域 store 統一管理資料                      |
| 多元件狀態不同步   | 共享同一份 state，任何改變都會即時同步           |
| 難以追蹤資料變化   | Redux DevTools 清楚顯示每次 action 與 state 差異 |

---

## 🎯 Redux 核心觀念

Redux 是一個 **全域狀態管理工具**，用於讓整個應用共用資料、可預測地追蹤 state 變化。

### 🔹 重要名詞解釋

#### 1️⃣ **Actions**：

- 定義： 描述應用中「發生了什麼事」的普通 JavaScript 物件。
- 必須包含 type 欄位（字串），通常命名為 domain/eventName 格式，例如 'todos/todoAdded'。
- 額外資訊可放在其他欄位中。

- 範例:

  ```ts
  const addTodoAction = {
    type: "todos/todoAdded",
    payload: "Buy milk",
  };
  ```

#### 2️⃣ Action Creators：

- 定義： 用來建立並回傳 action 物件的函式。
- 目的是避免每次都手動撰寫 action 物件。
- 範例：

  ```ts
  const addTodo = (text) => ({
    type: "todos/todoAdded",
    payload: text,
  });
  ```

#### 3️⃣ **Reducers**：

- 定義： 一個接收目前 state 與 action，回傳新 state 的純函式。
- 可以想像成事件監聽器（event listener），根據 action 的種類決定如何更新 state。

📋 規則：

1. 只能根據 state 與 action 計算新值。
2. 不可直接修改原本的 state（必須回傳拷貝的新物件）。
3. 必須是純函式：不可包含非同步操作、隨機值或副作用。

- 範例：

  ```ts
  // todosReducer.ts
  const initialState = { items: [] };

  const todosReducer = (state = initialState, action) => {
    if (action.type === "todos/todoAdded") {
      return {
        ...state, // 複製原本 state
        items: [...state.items, action.payload], // 再進行更新
      };
    }
    return state;
  };
  ```

💡 為什麼叫「Reducer」？
它的概念來自 Array.reduce() 方法：

```ts
const numbers = [2, 5, 8];
const addNumbers = (prev, cur) => prev + cur;
const total = numbers.reduce(addNumbers, 0); // 15
```

- 相同點：接收「前一次結果（state）」與「當前項目（action）」→ 回傳新結果（new state）
- 不同點：Redux 的執行方式只是「隨著時間」發生這些 reduce 過程，而非一次完成。

#### 4️⃣ **Store**：

- 定義： 儲存整個應用的所有 state（唯一來源）。
- 可以透過 `store.getState()` 取得目前 state。

  ```ts
  import { createStore, combineReducers } from "redux";

  const allReducers = combineReducers({
    todos: todosReducer,
  });
  const store = createStore(allReducers);

  console.log(store.getState());
  // { todos: { items: [] } }
  ```

- 如果有多個 reducer：

  ```ts
  const allReducers = combineReducers({
    todos: todosReducer,
    cart: cartReducer,
    products: productsReducer,
  });
  const store = createStore(allReducers);

  console.log(store.getState());
  // {
  //   todos: { items: [] },
  //   cart: { items: [], total: 0 },
  //   products: { list: [] }
  // }
  ```

#### 5️⃣ **Dispatch**：

- 定義： 改變 state 的**唯一**方式。
- 呼叫 store.dispatch(action) 會觸發 reducer，產生新的 state。
- 範例：
  ```ts
  store.dispatch({ type: "todos/todoAdded", payload: "Buy milk" });
  console.log(store.getState()); // { todos: { items: ["Buy milk"] } }
  ```
  使用 Action Creators：
  ```ts
  const addTodo = (text) => {
    return {
      type: "todos/todoAdded",
      payload: text,
    };
  };
  store.dispatch(addTodo("Buy milk"));
  console.log(store.getState()); // { todos: { items: ["Buy milk"] } }
  ```

#### 6️⃣ **Selectors**：

- 定義： 負責從 store 中提取特定資料的函式。
- 能避免不同元件重複撰寫取值邏輯。
- 範例：

  ```ts
  const selectItems = (state) => state.items;
  const items = selectItems(store.getState());
  console.log(items); // 目前待辦事項列表
  ```

### 🔹 Data Flow

🟢 **初始化階段（Initial setup）**：

1. 建立 store。
2. store 呼叫 reducer 一次，拿到初始 state。
3. UI 初次渲染，取得 store state，並且訂閱 store 更新。

🟠 **更新階段（Updates）**：

1. 使用者透過 UI (e.g. button click) 觸發事件。
2. app 發送 action (dispatch(action))。
3. store 執行 reducer 來更新 state。
4. store 通知所有訂閱的元件 state 改變了。
5. UI 元件檢查自己需要的 state 是否被更新，如果有更新，則重新渲染畫面。

## 🛠️ 實作範例：Todo List

### 1️⃣ 建立 Reducer

```ts
// src/store/todos-reducer.ts

const initialState = {
  items: [],
  filter: "all",
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "todos/addTodo":
      const newTodo = {
        id: Date.now(),
        title: action.payload,
        completed: false,
      };
      return {
        ...state,
        items: [...state.items, newTodo],
      };

    case "todos/completeTodo":
      return {
        ...state,
        items: state.items.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: true } : todo
        ),
      };

    case "todos/setFilter":
      return {
        ...state,
        filter: action.payload,
      };

    default:
      return state;
  }
};

export default todosReducer;
```

### 2️⃣ 建立 Action Creators

```ts
// src/store/todos-actions.ts

const addTodo = (title) => ({
  type: "todos/addTodo",
  payload: title,
});

const completeTodo = (id) => ({
  type: "todos/completeTodo",
  payload: id,
});

const setFilter = (filter) => ({
  type: "todos/setFilter",
  payload: filter,
});

export { addTodo, completeTodo, setFilter };
```

### 3️⃣ 建立 Selectors

```ts
// src/store/todos-selectors.ts
export const selectTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;
export const selectFilteredTodos = (state) => {
  const filter = selectFilter(state);
  const todos = selectTodos(state);

  if (filter === "all") {
    return todos;
  } else if (filter === "completed") {
    return todos.filter((todo) => todo.completed);
  } else if (filter === "active") {
    return todos.filter((todo) => !todo.completed);
  }
  return todos;
};
```

### 4️⃣ 建立 Store

```ts
// src/store/store.ts
import { createStore, combineReducers } from "redux";
import todosReducer from "./todos-reducer";

const allReducers = combineReducers({
  todos: todosReducer,
});

export const store = createStore(allReducers);
```

### 5️⃣ 在 \_app.tsx 中提供 Store

```tsx
// src/pages/_app.tsx
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
```

### 6️⃣ 在元件中使用 Redux

如果要在元件中讀取和修改 Redux 裡的 state，則要使用 `react-redux` 的 `useDispatch` 來發送 action，以及使用 `useSelector` 來選取 state。

```tsx
// src/pages/todos.tsx
import React, { useState } from "react";
import { addTodo, completeTodo, setFilter } from "@/store/todos-actions";
import { selectFilteredTodos } from "@/store/todos-selectors";
import { useDispatch, useSelector } from "react-redux";

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState("");
  const dispatch = useDispatch();
  const items = useSelector(selectFilteredTodos);

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button
        onClick={() => {
          dispatch(addTodo(newTodo));
          setNewTodo("");
        }}
      >
        Add Todo
      </button>

      <ul>
        {items.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            {!todo.completed && (
              <button onClick={() => dispatch(completeTodo(todo.id))}>
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>

      <div>
        <button onClick={() => dispatch(setFilter("all"))}>All</button>
        <button onClick={() => dispatch(setFilter("active"))}>Active</button>
        <button onClick={() => dispatch(setFilter("completed"))}>
          Completed
        </button>
      </div>
    </div>
  );
};
export default TodoApp;
```
