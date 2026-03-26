import { api } from "./api";

export interface Candidate {
  _id: string;
  name: string;
  email: string;
  position: string;
  status: "Applied" | "Interview" | "Hired" | "Rejected";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCandidatesResponse {
  success: boolean;
  candidates: Candidate[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  total: number;
  statusCounts: {
    Applied: number;
    Interview: number;
    Hired: number;
    Rejected: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const candidateApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ success: boolean; data: User }, { email: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getCandidates: builder.query<GetCandidatesResponse, any>({
      query: (params) => ({
        url: "/candidates",
        params,
      }),
      providesTags: ["Candidate"],
    }),
    getCandidate: builder.query<{ success: boolean; data: Candidate }, string>({
      query: (id) => `/candidates/${id}`,
      providesTags: (result, error, id) => [{ type: "Candidate", id }],
    }),
    addCandidate: builder.mutation<any, Partial<Candidate>>({
      query: (body) => ({
        url: "/candidates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Candidate", "Dashboard"],
    }),
    updateCandidate: builder.mutation<any, { id: string; body: Partial<Candidate> }>({
      query: ({ id, body }) => ({
        url: `/candidates/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Candidate", id },
        "Candidate",
        "Dashboard",
      ],
    }),
    deleteCandidate: builder.mutation<any, string>({
      query: (id) => ({
        url: `/candidates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Candidate", "Dashboard"],
    }),
    seedCandidates: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/candidates/seed",
        method: "POST",
      }),
      invalidatesTags: ["Candidate", "Dashboard"],
    }),
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetCandidatesQuery,
  useGetCandidateQuery,
  useAddCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useSeedCandidatesMutation,
  useGetDashboardStatsQuery,
} = candidateApi;
