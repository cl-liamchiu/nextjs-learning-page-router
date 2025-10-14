import { UnknownAction } from "redux";
import { AppDispatch, RootState } from "./store";

type Product = { id: number; title: string; price: number; thumbnail: string };
type ProductsState = { items: Product[]; loading: boolean; error?: string };
type ProductsAction =
  | { type: "products/fetchProducts/pending" }
  | { type: "products/fetchProducts/fulfilled"; payload: Product[] }
  | { type: "products/fetchProducts/rejected"; payload: string };
const initialState: ProductsState = { items: [], loading: false };

const isProductsAction = (
  action: ProductsAction | UnknownAction
): action is ProductsAction => {
  return (
    action.type === "products/fetchProducts/pending" ||
    action.type === "products/fetchProducts/fulfilled" ||
    action.type === "products/fetchProducts/rejected"
  );
};

const productsReducer = (
  state = initialState,
  action: ProductsAction | UnknownAction
): ProductsState => {
  if (isProductsAction(action)) {
    switch (action.type) {
      case "products/fetchProducts/pending":
        return { ...state, loading: true };
      case "products/fetchProducts/fulfilled":
        return { ...state, items: action.payload, loading: false };
      case "products/fetchProducts/rejected":
        console.error("Failed to fetch products: ", action.payload);
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  }
  return state;
};

const fetchProducts = async (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  dispatch({ type: "products/fetchProducts/pending" });
  try {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    dispatch({
      type: "products/fetchProducts/fulfilled",
      payload: data.products,
    });
  } catch (error: unknown) {
    dispatch({
      type: "products/fetchProducts/rejected",
      payload: (error as Error).message,
    });
  }
};

export default productsReducer;
export { fetchProducts };
