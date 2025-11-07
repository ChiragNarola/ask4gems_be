import { Router } from "express";
import { StatsController } from "../controllers/stats.controller";

const router = Router();

router.get('/', StatsController.getAppStatsHandler);
router.get('/db', StatsController.getDBStatsHandler);

export default router;