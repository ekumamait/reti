import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query/react";
import { customError } from "./types.ts";
import { getAccessToken, getHeaders } from "../utils.ts";

export type SupportRequestCategory = 'technical_issue' | 'account_recovery' | 'guidance' | 'general';
export type SupportRequestStatus = 'open' | 'in_progress' | 'resolved';

export interface SupportRequest {
    id: number;
    userId: number | null;
    contact: string;
    category: SupportRequestCategory;
    description: string;
    status: SupportRequestStatus;
    adminResponse: string | null;
    respondedAt: string | null;
    respondedBy?: { id: number; firstName: string; lastName: string } | null;
    user?: { id: number; firstName: string; lastName: string; phoneNumber: string } | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedSupportResponse {
    status: number;
    message: string;
    data: SupportRequest[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SupportRequestResponse {
    status: number;
    message: string;
    data: SupportRequest;
}

export const supportApi = createApi({
    reducerPath: 'supportApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`,
        prepareHeaders: (headers) => {
            const token = getAccessToken();
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['Support'],
    endpoints: ({ mutation, query }) => ({
        sendSupportRequest: mutation<SupportRequestResponse, { contact?: string; description: string; category?: SupportRequestCategory }>({
            query: (requestBody) => {
                return {
                    url: `support`,
                    method: 'POST',
                    body: requestBody,
                    headers: getAccessToken() ? getHeaders() : undefined,
                }
            },
            invalidatesTags: ['Support'],
        }),
        getMySupportRequests: query<PaginatedSupportResponse, void>({
            query: () => ({
                url: `support/mine`,
                method: 'GET',
                headers: getHeaders(),
            }),
            providesTags: ['Support'],
        }),
        getAllSupportRequests: query<PaginatedSupportResponse, { status?: SupportRequestStatus; page?: number; limit?: number } | void>({
            query: (params) => ({
                url: `support`,
                method: 'GET',
                params: params || undefined,
                headers: getHeaders(),
            }),
            providesTags: ['Support'],
        }),
        respondToSupportRequest: mutation<SupportRequestResponse, { id: number; response: string; status?: SupportRequestStatus }>({
            query: ({ id, ...body }) => ({
                url: `support/${id}/respond`,
                method: 'PATCH',
                body,
                headers: getHeaders(),
            }),
            invalidatesTags: ['Support'],
        }),
    }),
});

export const {
    useSendSupportRequestMutation,
    useGetMySupportRequestsQuery,
    useGetAllSupportRequestsQuery,
    useRespondToSupportRequestMutation,
} = supportApi;
