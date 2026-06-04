import { z } from "zod";

export const applySchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  coverLetter: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "ACCEPTED"]),
});
