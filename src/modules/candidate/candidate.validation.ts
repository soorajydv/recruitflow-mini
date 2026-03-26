import { z } from "zod";
import { CandidateStatus } from "./candidate.model";

export const createCandidateSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    position: z.string().min(1, "Position is required").min(2, "Position must be at least 2 characters"),
    status: z.nativeEnum(CandidateStatus).optional(),
  }),
});

export const updateCandidateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    position: z.string().min(2).optional(),
    status: z.nativeEnum(CandidateStatus).optional(),
  }),
});
