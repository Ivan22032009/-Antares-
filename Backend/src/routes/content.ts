import { Router } from 'express';
import { getPageContent, updatePageContent } from '../controllers/contentController';

const router = Router();

router.get('/:pageName', getPageContent);
router.put('/:pageName', updatePageContent);

export default router;
