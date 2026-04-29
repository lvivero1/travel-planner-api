import { Router } from "express";

import {
  createDestination,
  deleteDestination,
  getDestinationById,
  getDestinations,
  updateDestination,
} from "../controllers/destinationController.js";

const router = Router();

router.post("/", createDestination);
router.get("/", getDestinations);
router.get("/:id", getDestinationById);
router.put("/:id", updateDestination);
router.delete("/:id", deleteDestination);

export default router;