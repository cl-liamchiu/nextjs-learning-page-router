import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { todosApi } from "./api/todos-api";
import counterReducer from "./counter-slice";
import todoReducer from "./todos-slice";
import productsReducer from "./products-slice";
import cartReducer from "./cart-slice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
    cart: cartReducer,
    products: productsReducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
