import { Router } from 'express';
import {
  createImage,
  deleteImage,
  getAllImages,
  getImageById,
  updateImage,
} from '../controllers/galleryController';

const router = Router();

router.get('/', getAllImages);
router.get('/:id', getImageById);
router.post('/', createImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

export default router;
