import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export const createCompanyService = async (data: {
  name: string;
  description?: string;
  website?: string;
  location?: string;
  logo?: string;
  ownerId: string;
}) => {
  const existing = await prisma.company.findUnique({ where: { ownerId: data.ownerId } });
  if (existing) {
    throw new AppError("User already owns a company", 409);
  }

  return prisma.company.create({
    data: {
      name: data.name,
      description: data.description,
      website: data.website,
      location: data.location,
      logo: data.logo,
      ownerId: data.ownerId,
    },
  });
};

export const getCompanyService = async (id: string) => {
  const company = await prisma.company.findUnique({
    where: { id },
    include: { jobs: { where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" } } },
  });
  if (!company) throw new AppError("Company not found", 404);
  return company;
};

export const updateCompanyService = async (id: string, ownerId: string, data: any) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) throw new AppError("Company not found", 404);
  if (company.ownerId !== ownerId) throw new AppError("Not authorized", 403);
  return prisma.company.update({ where: { id }, data });
};
