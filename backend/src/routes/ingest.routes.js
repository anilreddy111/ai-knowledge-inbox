import { Router } from "express";
import { ingest } from "../controllers/ingest.controller.js";

const router = Router();

router.post("/ingest", ingest);

export default router;