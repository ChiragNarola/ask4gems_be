import { Router } from 'express';
import { getBuyerContact, getPublic, listPublic } from '../controllers/requests.controller';
import { authorize } from '../middlewares/authorize';

const router = Router();

// Publicly visible requests
router.get('/', listPublic);
router.get('/:id', getPublic);

// Buyer contact requires authentication
router.get('/:id/buyer-contact', authorize, getBuyerContact);

export default router;


