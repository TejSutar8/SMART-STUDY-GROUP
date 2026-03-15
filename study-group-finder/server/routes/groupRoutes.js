import { Router } from 'express';
import { createGroup, getGroups, joinGroup, leaveGroup, upcomingSessions } from '../controllers/groupController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create', authMiddleware, createGroup);
router.get('/', authMiddleware, getGroups);
router.post('/join', authMiddleware, joinGroup);
router.post('/leave', authMiddleware, leaveGroup);
router.get('/upcoming', authMiddleware, upcomingSessions);

export default router;
