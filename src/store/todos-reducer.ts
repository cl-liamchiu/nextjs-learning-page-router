import { UnknownAction } from "redux";
import { RootState } from "./store";

type Todo = { id: number; title: string; completed: boolean };
type TodosState = { items: Todo[]; filter: string };
type TodosAction =
  | { type: "todos/addTodo"; payload: Todo }
  | { type: "todos/completeTodo"; payload: number }
  | { type: "todos/setFilter"; payload: string };
const initialState: TodosState = { items: [], filter: "all" };

const isTodosAction = (
  action: TodosAction | UnknownAction
): action is TodosAction => {
  return (
    action.type === "todos/addTodo" ||
    action.type === "todos/completeTodo" ||
    action.type === "todos/setFilter"
  );
};

const todosReducer = (
  state = initialState,
  action: TodosAction | UnknownAction
): TodosState => {
  if (isTodosAction(action)) {
    switch (action.type) {
      case "todos/addTodo":
        return {
          ...state,
          items: [...state.items, action.payload],
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
  }
  return state;
};

const addTodo = (todo: Todo): TodosAction => ({
  type: "todos/addTodo",
  payload: todo,
});

const completeTodo = (id: number): TodosAction => ({
  type: "todos/completeTodo",
  payload: id,
});

const setFilter = (filter: string): TodosAction => ({
  type: "todos/setFilter",
  payload: filter,
});

const selectFilteredTodos = (state: RootState) => {
  const { items, filter } = state.todos;
  switch (filter) {
    case "completed":
      return items.filter((t) => t.completed);
    case "active":
      return items.filter((t) => !t.completed);
    case "all":
    default:
      return items;
  }
};

export default todosReducer;
export { addTodo, completeTodo, setFilter, selectFilteredTodos };
