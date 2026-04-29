import { Router } from "express";

import {
  createActivity,
  deleteActivity,
  getActivities,
  getActivityById,
  updateActivity,
} from "../controllers/activityController.js";

const router = Router();

router.post("/", createActivity);
router.get("/", getActivities);
router.get("/:id", getActivityById);
router.put("/:id", updateActivity);
router.delete("/:id", deleteActivity);

export default router;