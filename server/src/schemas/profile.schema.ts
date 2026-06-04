import { z } from "zod";

export const updateProfileSchema = z.object({
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().optional(),
  skills: z.array(z.string()).optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
});

export const experienceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.current) return true;
      if (!data.endDate) return true;
      return data.endDate > data.startDate;
    },
    { message: "End date must be after start date", path: ["endDate"] },
  );

export const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    school: z.string().min(1, "School is required"),
    field: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.current) return true;
      if (!data.endDate) return true;
      return data.endDate > data.startDate;
    },
    { message: "End date must be after start date", path: ["endDate"] },
  );
