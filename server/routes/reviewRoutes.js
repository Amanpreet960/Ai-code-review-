import { Router } from 'express';
import { reviewCode } from '../controllers/reviewController.js';
const router = Router();
router.post('/', reviewCode);
export default router;
