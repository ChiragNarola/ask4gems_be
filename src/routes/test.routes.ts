import { Router } from 'express';
import { TestController } from '../controllers/test.controller';

const router = Router();

router.get('/send-email', TestController.sendEmailHandler);
router.get('/log', TestController.logHandler);

export default router;
