import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const createJobService = async (data: {
  title: string;
  description: string;
  location?: string | null;
  type?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills?: string[];
  experience?: string | null;
  companyId: string;
}) => {
  return prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      type: (data.type as any) || "FULL_TIME",
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      skills: data.skills || [],
      experience: data.experience,
      companyId: data.companyId,
    },
    include: {
      company: { select: { name: true, location: true, description: true } },
    },
  });
};

export const searchJobsService = async (filters: {
  title?: string;
  location?: string;
  type?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}) => {
  const title = filters.title?.trim();
  const location = filters.location?.trim();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const skip = (page - 1) * limit;

  const conditions: any[] = [];

  if (title) {
    conditions.push({
      title: { contains: title, mode: "insensitive" as const },
    });
  }
  if (location) {
    conditions.push({
      location: { contains: location, mode: "insensitive" as const },
    });
  }
  if (filters.type) {
    conditions.push({ type: filters.type as any });
  }
  if (filters.experience) {
    conditions.push({ experience: filters.experience });
  }
  if (filters.salaryMin !== undefined) {
    conditions.push({ salaryMax: { gte: filters.salaryMin } });
  }
  if (filters.salaryMax !== undefined) {
    conditions.push({ salaryMin: { lte: filters.salaryMax } });
  }

  const where = {
    status: "ACTIVE" as const,
    ...(conditions.length > 0 ? { AND: conditions } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: {
        company: { select: { name: true, location: true, description: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getJobService = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: { name: true, location: true, logo: true, description: true },
      },
      _count: { select: { applications: true } },
    },
  });
  if (!job) throw new AppError("Job not found", 404);
  return job;
};

export const updateJobService = async (
  id: string,
  companyId: string,
  data: any,
) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new AppError("Job not found", 404);
  if (job.companyId !== companyId) throw new AppError("Not authorized", 403);
  return prisma.job.update({ where: { id }, data });
};

export const deleteJobService = async (id: string, companyId: string) => {
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new AppError("Job not found", 404);
  if (job.companyId !== companyId) throw new AppError("Not authorized", 403);
  await prisma.$transaction([
    prisma.application.deleteMany({ where: { jobId: id } }),
    prisma.savedJob.deleteMany({ where: { jobId: id } }),
    prisma.job.delete({ where: { id } }),
  ]);
};

export const getJobsByCompanyService = async (companyId: string) => {
  return prisma.job.findMany({
    where: { companyId },
    include: {
      company: { select: { name: true, location: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getJobStatsService = async (companyId: string) => {
  const [activeJobs, totalApplications] = await Promise.all([
    prisma.job.count({ where: { companyId, status: "ACTIVE" } }),
    prisma.application.count({ where: { job: { companyId } } }),
  ]);
  return { activeJobs, totalApplications };
};
