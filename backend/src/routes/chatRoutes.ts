import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/message', authMiddleware, sendMessage);
router.get('/history', authMiddleware, getChatHistory);

export default router;
