import express from 'express';
import { saveProfile, getProfile } from '../controllers/profileController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/profile', authMiddleware, saveProfile);
router.get('/profile', authMiddleware, getProfile);

export default router;
