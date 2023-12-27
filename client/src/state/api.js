import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Company", "Transactions"],
  endpoints: (build) => ({
    getCompany: build.query({
      query: (id) => `inbound/getCompany/${id}`,
      providesTags: ["Company"],
    }),
  }),
});
export const { useGetCompanyQuery, useGetTransactionsQuery } = api;
