import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import {
  getProfile,
  getProfileByUserId,
  updateProfile,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  uploadResumeController,
  uploadAvatarController,
} from "../controllers/profile.controller";
import { uploadResume, uploadAvatar } from "../lib/multer";

const router = Router();

router.get("/", protect, authorize("CANDIDATE"), getProfile);
router.get("/:userId", protect, authorize("COMPANY_ADMIN"), getProfileByUserId);
router.put("/", protect, authorize("CANDIDATE"), updateProfile);
router.post("/resume", protect, authorize("CANDIDATE"), uploadResume.single("resume"), uploadResumeController);
router.post("/avatar", protect, authorize("CANDIDATE"), uploadAvatar.single("avatar"), uploadAvatarController);

router.post("/experiences", protect, authorize("CANDIDATE"), createExperience);
router.put("/experiences/:id", protect, authorize("CANDIDATE"), updateExperience);
router.delete("/experiences/:id", protect, authorize("CANDIDATE"), deleteExperience);

router.post("/educations", protect, authorize("CANDIDATE"), createEducation);
router.put("/educations/:id", protect, authorize("CANDIDATE"), updateEducation);
router.delete("/educations/:id", protect, authorize("CANDIDATE"), deleteEducation);

export default router;
