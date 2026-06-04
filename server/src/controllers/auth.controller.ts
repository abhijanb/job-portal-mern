import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../utils/validate";
import { registerSchema, loginSchema } from "../schemas";
import * as authService from "../services/auth.service";
import { success, created, message } from "../utils/apiResponse";
import { clearCookie, sendCookie } from "../utils/cookie";
import env from "../utils/env";

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = validate(registerSchema, req.body);
  const { user, token } = await authService.registerUser(data);
  if (token) {
    sendCookie(res, "token", token, env.COOKIE_MAX_AGE); // 7 days
  }
  created(res, { user });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = validate(loginSchema, req.body);
  const { user, token } = await authService.loginUser(email, password);
  if (token) {
    sendCookie(res, "token", token, env.COOKIE_MAX_AGE); // 7 days
  }
  success(res, { user });
});

export const logout = asyncHandler(async (_req: AuthRequest, res: Response) => {
  clearCookie(res, "token");
  message(res, "Logged out");
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await authService.findUserById(req.userId!);
  success(res, { user });
});
