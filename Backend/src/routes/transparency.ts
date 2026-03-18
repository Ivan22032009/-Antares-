import { Router } from 'express';
import {
  getAllTransparency,
  getTransparencyByType,
  updateTransparencyByType,
} from '../controllers/transparencyController';

const router = Router();

router.get('/', getAllTransparency);
router.get('/:sectionType', getTransparencyByType);
router.put('/:sectionType', updateTransparencyByType);

export default router;
