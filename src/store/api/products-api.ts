import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Todo = { id: number; title: string; completed: boolean };

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    getproducts: builder.query<Todo[], void>({
      query: () => "products",
    }),
  }),
});

export const { useGetproductsQuery } = productsApi;
