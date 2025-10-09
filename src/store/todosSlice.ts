import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

type Todo = { id: number; title: string; completed: boolean };
type TodosState = { items: Todo[]; filter: "all" | "completed" | "active" };

const initialState: TodosState = { items: [], filter: "all" };

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    completeTodo: (state, action) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { addTodo, completeTodo, setFilter } = todosSlice.actions;
export default todosSlice.reducer;

const selectItems = (state: RootState) => state.todos.items;
const selectFilter = (state: RootState) => state.todos.filter;

export const selectFilteredTodos = createSelector(
  [selectItems, selectFilter],
  (items, filter) => {
    switch (filter) {
      case "completed":
        return items.filter((t) => t.completed);
      case "active":
        return items.filter((t) => !t.completed);
      case "all":
      default:
        return items;
    }
  }
);
