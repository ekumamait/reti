import {createApi, fetchBaseQuery, BaseQueryFn, FetchArgs} from "@reduxjs/toolkit/query/react"
import {
    customError,
    LoginResponseType,
    OpportunitiesResponseType,
    OpportunitiesType,
    OpportunitiesDetailsResponseType
} from "./types.ts";
import {getHeaders} from "../utils.ts";



export const opportunityApi = createApi({
    reducerPath: 'opportunityApi',
    baseQuery: fetchBaseQuery(
        {
            baseUrl: `${import.meta.env.VITE_BASE_URL}/v1/`
        }
    ) as BaseQueryFn<string | FetchArgs, unknown, customError>,
    tagTypes: ['Opportunities'],
    endpoints: ({mutation, query}) => ({
        addOpportunity: mutation<LoginResponseType, User>({
            query: (data) => ({
                url: 'jobs',
                method: 'POST',
                headers: getHeaders(),
                body: data,
            }),
            invalidatesTags: ['Opportunities']
        }),
        getOpportunities: query<OpportunitiesResponseType, void>({
            query: () => ({
                url: `jobs`,
                method: "GET",
                headers: getHeaders(),
            }),
            providesTags: ['Opportunities']
        }),
        getOpportunityDetails: query<OpportunitiesDetailsResponseType, string>({
            query: (jobId) => ({
                url: `jobs/${jobId}`,
                method: "GET",
                headers: getHeaders(),
            }),
            providesTags: ['Opportunities']
        }),
        updateOpportunity: mutation<OpportunitiesType, { payload:OpportunitiesType, jobID:number }>({
            query: ({payload, jobID}) => ({
                url: `jobs/${jobID}`,
                method: "PATCH",
                body: payload,
                headers: getHeaders(),
            }),
            invalidatesTags: ['Opportunities']
        }),
        deleteOpportunity: mutation<OpportunitiesType, number>({
            query: (jobID) => ({
                url: `jobs/${jobID}`,
                method: "DELETE",
                headers: getHeaders(),
            }),
            invalidatesTags: ['Opportunities']
        }),
    })
})

export const {
    useAddOpportunityMutation,
    useGetOpportunitiesQuery,
    useUpdateOpportunityMutation,
    useDeleteOpportunityMutation,
    useGetOpportunityDetailsQuery
} = opportunityApi