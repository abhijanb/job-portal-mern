import { Router } from "express";
import { protect, authorize } from "../middleware/auth.middleware";
import { getSavedJobs, saveJob, removeSavedJob } from "../controllers/savedJob.controller";

const router = Router();

router.get("/", protect, authorize("CANDIDATE"), getSavedJobs);
router.post("/", protect, authorize("CANDIDATE"), saveJob);
router.delete("/:jobId", protect, authorize("CANDIDATE"), removeSavedJob);

export default router;
