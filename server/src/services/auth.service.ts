import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/token";

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  role?: string;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new AppError("Email already in use", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role?.toUpperCase() === "CANDIDATE" ? "CANDIDATE" : "COMPANY_ADMIN",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      company: { select: { id: true } },
    },
  });

  const token = signToken(user.id, user.role);

  return { user: { ...user, companyId: user.company?.id ?? null }, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { company: { select: { id: true } } },
  });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = signToken(user.id, user.role);

  const { password: _, company, ...userWithoutPassword } = user;
  return { user: { ...userWithoutPassword, companyId: company?.id ?? null }, token };
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      company: { select: { id: true } },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return { ...user, companyId: user.company?.id ?? null };
};
