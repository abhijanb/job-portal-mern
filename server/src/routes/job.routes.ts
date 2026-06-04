import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobsByCompany,
  getJobStats,
} from "../controllers/job.controller";

const router = Router();

router.get("/", getJobs);
router.get("/stats", protect, authorize("COMPANY_ADMIN"), getJobStats);
router.get("/company/:companyId", getJobsByCompany);
router.get("/:id", getJob);
router.post("/", protect, authorize("COMPANY_ADMIN"), createJob);
router.put("/:id", protect, authorize("COMPANY_ADMIN"), updateJob);
router.delete("/:id", protect, authorize("COMPANY_ADMIN"), deleteJob);

export default router;
