import { Response } from "express";
import { AuthRequest } from "../types";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../utils/validate";
import {
  createCompanySchema,
  updateCompanySchema,
  idParamSchema,
} from "../schemas";
import * as companyService from "../services/company.service";
import { success, created } from "../utils/apiResponse";

export const createCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = validate(createCompanySchema, req.body);
    const company = await companyService.createCompanyService({
      ...data,
      ownerId: req.userId!,
    });
    created(res, company);
  },
);

export const getCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const company = await companyService.getCompanyService(id);
    success(res, company);
  },
);

export const updateCompany = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = validate(idParamSchema, req.params);
    const data = validate(updateCompanySchema, req.body);
    const company = await companyService.updateCompanyService(
      id,
      req.userId!,
      data,
    );
    success(res, company);
  },
);
