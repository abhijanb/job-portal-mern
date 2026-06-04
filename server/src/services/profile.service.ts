import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const getCandidateProfileService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
    },
  });
  if (!profile) throw new AppError("Profile not found", 404);
  return profile;
};

export const getProfileService = async (userId: string) => {
  let profile = await prisma.profile.findUnique({
    where: { userId },
    include: {
      experiences: { orderBy: { startDate: "desc" } },
      educations: { orderBy: { startDate: "desc" } },
    },
  });
  if (!profile) {
    profile = await prisma.profile.create({
      data: { userId },
      include: { experiences: true, educations: true },
    });
  }
  return profile;
};

export const updateProfileService = async (userId: string, data: any) => {
  let profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.profile.create({ data: { userId } });
  }
  return prisma.profile.update({ where: { userId }, data });
};

// Experience
export const createExperienceService = async (
  userId: string,
  data: {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  },
) => {
  let profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.profile.create({ data: { userId } });
  }
  return prisma.experience.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      profileId: profile.id,
    },
  });
};

export const updateExperienceService = async (
  userId: string,
  experienceId: string,
  data: {
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string | null;
    current?: boolean;
    description?: string;
  },
) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new AppError("Profile not found", 404);
  const exp = await prisma.experience.findFirst({
    where: { id: experienceId, profileId: profile.id },
  });
  if (!exp) throw new AppError("Experience not found", 404);
  const updateData: any = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  return prisma.experience.update({
    where: { id: experienceId },
    data: updateData,
  });
};

export const deleteExperienceService = async (
  userId: string,
  experienceId: string,
) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new AppError("Profile not found", 404);
  const exp = await prisma.experience.findFirst({
    where: { id: experienceId, profileId: profile.id },
  });
  if (!exp) throw new AppError("Experience not found", 404);
  return prisma.experience.delete({ where: { id: experienceId } });
};

// Education
export const createEducationService = async (
  userId: string,
  data: {
    degree: string;
    school: string;
    field?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  },
) => {
  let profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await prisma.profile.create({ data: { userId } });
  }
  return prisma.education.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      profileId: profile.id,
    },
  });
};

export const updateEducationService = async (
  userId: string,
  educationId: string,
  data: {
    degree?: string;
    school?: string;
    field?: string;
    startDate?: string;
    endDate?: string | null;
    current?: boolean;
    description?: string;
  },
) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new AppError("Profile not found", 404);
  const edu = await prisma.education.findFirst({
    where: { id: educationId, profileId: profile.id },
  });
  if (!edu) throw new AppError("Education not found", 404);
  const updateData: any = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate !== undefined)
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  return prisma.education.update({
    where: { id: educationId },
    data: updateData,
  });
};

export const deleteEducationService = async (
  userId: string,
  educationId: string,
) => {
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) throw new AppError("Profile not found", 404);
  const edu = await prisma.education.findFirst({
    where: { id: educationId, profileId: profile.id },
  });
  if (!edu) throw new AppError("Education not found", 404);
  return prisma.education.delete({ where: { id: educationId } });
};
