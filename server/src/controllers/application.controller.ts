import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../utils/validate";
import {
  applySchema,
  updateApplicationStatusSchema,
  idParamSchema,
  jobIdParamSchema,
} from "../schemas";
import * as applicationService from "../services/application.service";
import { success, created } from "../utils/apiResponse";

export const apply = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobId, coverLetter } = validate(applySchema, req.body);
  const application = await applicationService.applyService(
    req.userId!,
    jobId,
    coverLetter,
  );
  created(res, application);
});

export const getMyApplications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const applications = await applicationService.getMyApplicationsService(
      req.userId!,
    );
    success(res, applications);
  },
);

export const getCompanyApplications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const companyId = await applicationService.getUserCompanyIdService(
      req.userId!,
    );
    const applications =
      await applicationService.getCompanyApplicationsService(companyId);
    success(res, applications);
  },
);

export const getJobApplications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { jobId } = validate(jobIdParamSchema, req.params);
    const applications =
      await applicationService.getJobApplicationsService(jobId);
    success(res, applications);
  },
);

export const updateApplicationStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const { status } = validate(updateApplicationStatusSchema, req.body);
    const application = await applicationService.updateApplicationStatusService(
      id,
      status,
    );
    success(res, application);
  },
);
