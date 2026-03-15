import { Router } from 'express';
import { createMessage, getMessages } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:groupId', authMiddleware, getMessages);
router.post('/', authMiddleware, createMessage);

export default router;
