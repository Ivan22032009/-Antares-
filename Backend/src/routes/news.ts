import { Router } from 'express';
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from '../controllers/newsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', authMiddleware, createNews);
router.put('/:id', authMiddleware, updateNews);
router.delete('/:id', authMiddleware, deleteNews);

export default router;
