import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../utils/validate";
import {
  updateProfileSchema,
  experienceSchema,
  educationSchema,
  idParamSchema,
  userIdParamSchema,
} from "../schemas";
import * as profileService from "../services/profile.service";
import { success, created } from "../utils/apiResponse";
import env from "../utils/env";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const profile = await profileService.getProfileService(req.userId!);
    success(res, profile);
  },
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validate(updateProfileSchema, req.body);
    const profile = await profileService.updateProfileService(
      req.userId!,
      data,
    );
    success(res, profile);
  },
);

// Experience
export const createExperience = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validate(experienceSchema, req.body);
    const exp = await profileService.createExperienceService(req.userId!, data);
    created(res, exp);
  },
);

export const updateExperience = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const data = validate(experienceSchema, req.body);
    const exp = await profileService.updateExperienceService(
      req.userId!,
      id,
      data,
    );
    success(res, exp);
  },
);

export const deleteExperience = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    await profileService.deleteExperienceService(req.userId!, id);
    success(res, { message: "Experience deleted" });
  },
);

// Education
export const createEducation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validate(educationSchema, req.body);
    const edu = await profileService.createEducationService(req.userId!, data);
    created(res, edu);
  },
);

export const updateEducation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const data = validate(educationSchema, req.body);
    const edu = await profileService.updateEducationService(
      req.userId!,
      id,
      data,
    );
    success(res, edu);
  },
);

export const deleteEducation = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    await profileService.deleteEducationService(req.userId!, id);
    success(res, { message: "Education deleted" });
  },
);

export const uploadResumeController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }
    const resumeUrl = `${req.protocol}://${req.get("host")}/uploads/resumes/${file.filename}`;
    const profile = await profileService.updateProfileService(req.userId!, {
      resumeUrl,
    });
    success(res, profile);
  },
);

export const uploadAvatarController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }
    const avatar = `${req.protocol}://${req.get("host")}/uploads/avatars/${file.filename}`;
    const profile = await profileService.updateProfileService(req.userId!, {
      avatar,
    });
    success(res, profile);
  },
);

export const getProfileByUserId = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = validate(userIdParamSchema, req.params);
    const profile = await profileService.getCandidateProfileService(userId);
    success(res, profile);
  },
);
