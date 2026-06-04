import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const getUserCompanyIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { company: { select: { id: true } } },
  });
  if (!user?.company?.id)
    throw new AppError("No company found for this user", 404);
  return user.company.id;
};

export const applyService = async (
  userId: string,
  jobId: string,
  coverLetter?: string,
) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new AppError("Job not found", 404);
  if (job.status !== "ACTIVE")
    throw new AppError("Job is not accepting applications", 400);

  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) throw new AppError("Already applied to this job", 409);

  return prisma.application.create({
    data: { userId, jobId, coverLetter },
    include: {
      job: { select: { title: true, company: { select: { name: true } } } },
    },
  });
};

export const getMyApplicationsService = async (userId: string) => {
  return prisma.application.findMany({
    where: { userId },
    include: {
      job: {
        select: {
          title: true,
          location: true,
          type: true,
          company: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getJobApplicationsService = async (jobId: string) => {
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: { user: { select: { name: true, email: true, profile: true } } },
    orderBy: { createdAt: "desc" },
  });

  return applications;
};

export const getCompanyApplicationsService = async (companyId: string) => {
  return prisma.application.findMany({
    where: { job: { companyId } },
    include: {
      user: { select: { name: true, email: true } },
      job: { select: { title: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateApplicationStatusService = async (
  id: string,
  status: string,
) => {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) throw new AppError("Application not found", 404);
  return prisma.application.update({
    where: { id },
    data: { status: status as any },
  });
};
