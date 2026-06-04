import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const getSavedJobsService = async (userId: string) => {
  return prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        select: { id: true, title: true, location: true, type: true, salaryMin: true, salaryMax: true, company: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const saveJobService = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError("Job not found", 404);

  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) throw new AppError("Job already saved", 409);

  return prisma.savedJob.create({
    data: { userId, jobId },
    include: {
      job: {
        select: { id: true, title: true, location: true, type: true, salaryMin: true, salaryMax: true, company: { select: { name: true } } },
      },
    },
  });
};

export const removeSavedJobService = async (userId: string, jobId: string) => {
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (!existing) throw new AppError("Saved job not found", 404);

  await prisma.savedJob.delete({
    where: { userId_jobId: { userId, jobId } },
  });
};
