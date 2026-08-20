import { Router } from "express";
import { query } from "../controllers/query.controller.js";

const router = Router();

router.post("/query", query);

export default router;