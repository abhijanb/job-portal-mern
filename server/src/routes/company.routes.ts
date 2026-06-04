import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import {
  getCompany,
  createCompany,
  updateCompany,
} from "../controllers/company.controller";

const router = Router();

router.get("/:id", getCompany);
router.post("/", protect, authorize("COMPANY_ADMIN"), createCompany);
router.put("/:id", protect, authorize("COMPANY_ADMIN"), updateCompany);

export default router;
