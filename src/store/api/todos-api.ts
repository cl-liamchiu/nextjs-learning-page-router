import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Todo = { id: number; title: string; completed: boolean };

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => "todos?_limit=5",
    }),
  }),
});

// 自動產生 hook
export const { useGetTodosQuery } = todosApi;
