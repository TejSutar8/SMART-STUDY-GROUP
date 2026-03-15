import { Router } from 'express';
import { createRating } from '../controllers/ratingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authMiddleware, createRating);

export default router;
