import { Router } from "express";
import {
  createCaterer,
  getCatererById,
  getCaterers
} from "../controllers/catererController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", getCaterers);
router.get("/:id", getCatererById);
router.post("/", requireAdmin, createCaterer);

export default router;
