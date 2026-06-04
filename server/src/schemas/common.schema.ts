import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const jobIdParamSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
});

export const companyIdParamSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
});

export const userIdParamSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});
