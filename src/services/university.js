import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const universityApi = createApi({
  reducerPath: "universityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/universities/`,
  }),
  endpoints: (builder) => ({
    getUniversities: builder.query({
      query: () => "",
    }),
  }),
});

export const { useGetUniversitiesQuery } = universityApi;
