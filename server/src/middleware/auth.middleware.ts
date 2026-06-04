import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types";
import { AppError } from "../utils/AppError";

interface JwtPayload {
  userId: string;
  role: string;
}

export const protect = (req: AuthRequest, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization?.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    return next(new AppError("Not authorized, invalid token", 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return next(new AppError("Not authorized for this action", 403));
    }
    next();
  };
};
