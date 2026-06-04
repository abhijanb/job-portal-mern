import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../utils/validate";
import {
  createJobSchema,
  updateJobSchema,
  searchJobsSchema,
  idParamSchema,
  companyIdParamSchema,
} from "../schemas";
import * as jobService from "../services/job.service";
import { getUserCompanyIdService } from "../services/application.service";
import { success, created, message, paginated } from "../utils/apiResponse";

export const createJob = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validate(createJobSchema, req.body);
    const companyId = await getUserCompanyIdService(req.userId!);
    const job = await jobService.createJobService({ ...data, companyId });
    created(res, job);
  },
);

export const getJobs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filters = validate(searchJobsSchema, req.query);
  const result = await jobService.searchJobsService(filters);
  paginated(res, result.data, result.pagination);
});

export const getJob = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params);
  const job = await jobService.getJobService(id);
  success(res, job);
});

export const updateJob = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const data = validate(updateJobSchema, req.body);
    const companyId = await getUserCompanyIdService(req.userId!);
    const job = await jobService.updateJobService(id, companyId, data);
    success(res, job);
  },
);

export const deleteJob = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const companyId = await getUserCompanyIdService(req.userId!);
    await jobService.deleteJobService(id, companyId);
    message(res, "Job deleted");
  },
);

export const getJobsByCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { companyId } = validate(companyIdParamSchema, req.params);
    const jobs = await jobService.getJobsByCompanyService(companyId);
    success(res, jobs);
  },
);

export const getJobStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const companyId = await getUserCompanyIdService(req.userId!);
    const stats = await jobService.getJobStatsService(companyId);
    success(res, stats);
  },
);
