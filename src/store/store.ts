import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  applyMiddleware,
  legacy_createStore as createStore,
  combineReducers,
} from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import { thunk } from "redux-thunk";
import productsReducer from "./products-reducer";
import cartReducer from "./cart-slice";
import todosReducer from "./todos-reducer";
import counterReducer from "./counter-slice";

const allReducer = combineReducers({
  todos: todosReducer,
  cart: cartReducer,
  products: productsReducer,
  counter: counterReducer,
});

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancer = composeWithDevTools({
  trace: true,        // 開啟 Trace
  traceLimit: 25,     // 最多顯示 25 層 stack
})(middlewareEnhancer);

export const store = createStore(allReducer, composedEnhancer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
