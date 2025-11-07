import { Router } from "express";
import { LogController } from "../controllers/logs.controller";

const router = Router();

router.post('/', LogController.listHandler);

export default router;