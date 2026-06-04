import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../utils/validate";
import { saveJobSchema, jobIdParamSchema } from "../schemas";
import * as savedJobService from "../services/savedJob.service";
import { success, created, message } from "../utils/apiResponse";

export const getSavedJobs = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const savedJobs = await savedJobService.getSavedJobsService(req.userId!);
    success(res, savedJobs);
  },
);

export const saveJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { jobId } = validate(saveJobSchema, req.body);
  const savedJob = await savedJobService.saveJobService(req.userId!, jobId);
  created(res, savedJob);
});

export const removeSavedJob = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { jobId } = validate(jobIdParamSchema, req.params);
    await savedJobService.removeSavedJobService(req.userId!, jobId);
    message(res, "Job unsaved");
  },
);
