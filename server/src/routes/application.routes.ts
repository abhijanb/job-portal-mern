import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import {
  apply,
  getMyApplications,
  getJobApplications,
  getCompanyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";

const router = Router();

router.post("/", protect, authorize("CANDIDATE"), apply);
router.get("/mine", protect, authorize("CANDIDATE"), getMyApplications);
router.get("/company", protect, authorize("COMPANY_ADMIN"), getCompanyApplications);
router.get("/job/:jobId", protect, authorize("COMPANY_ADMIN"), getJobApplications);
router.patch("/:id/status", protect, authorize("COMPANY_ADMIN"), updateApplicationStatus);

export default router;
