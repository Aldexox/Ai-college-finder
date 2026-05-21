import express from 'express';
import {
  getColleges,
  getCollegeDetails,
  getRecommendations,
  addFavorite,
  removeFavorite,
  getFavorites,
} from '../controllers/collegeController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/colleges', authMiddleware, getColleges);
router.get('/colleges/recommendations', authMiddleware, getRecommendations);
router.get('/colleges/:id', authMiddleware, getCollegeDetails);
router.post('/favorites', authMiddleware, addFavorite);
router.delete('/favorites/:collegeId', authMiddleware, removeFavorite);
router.get('/favorites', authMiddleware, getFavorites);

export default router;
