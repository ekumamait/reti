import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import {
    customError,
    WelcomeImagesResponseType,
    WelcomeImageResponseType,
    CreateWelcomeImageDto,
} from "./types.ts";
import { getHeaders } from "../utils.ts";

export const welcomeImagesApi = createApi({
    reducerPath: 'welcomeImagesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['WelcomeImages'],
    endpoints: (builder) => ({
        getWelcomeImages: builder.query<WelcomeImagesResponseType, void>({
            query: () => ({
                url: 'welcome-images',
                method: 'GET',
            }),
            providesTags: ['WelcomeImages']
        }),
        addWelcomeImage: builder.mutation<WelcomeImageResponseType, CreateWelcomeImageDto>({
            query: (data) => ({
                url: 'welcome-images',
                method: 'POST',
                headers: getHeaders(),
                body: data,
            }),
            invalidatesTags: ['WelcomeImages']
        }),
        updateWelcomeImage: builder.mutation<WelcomeImageResponseType, { id: number, data: Partial<CreateWelcomeImageDto> }>({
            query: ({ id, data }) => ({
                url: `welcome-images/${id}`,
                method: 'PATCH',
                headers: getHeaders(),
                body: data,
            }),
            invalidatesTags: ['WelcomeImages']
        }),
        deleteWelcomeImage: builder.mutation<void, number>({
            query: (id) => ({
                url: `welcome-images/${id}`,
                method: 'DELETE',
                headers: getHeaders(),
            }),
            invalidatesTags: ['WelcomeImages']
        }),
    })
})

export const {
    useGetWelcomeImagesQuery,
    useAddWelcomeImageMutation,
    useUpdateWelcomeImageMutation,
    useDeleteWelcomeImageMutation
} = welcomeImagesApi
