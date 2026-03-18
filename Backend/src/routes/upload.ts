import { Router, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { deleteFile, listFiles, uploadFile } from '../services/r2Service';

const router = Router();

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error('Only image and document files are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter,
});

router.post('/', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const category = String(req.body?.category || 'general');
    const folder = category === 'transparency' ? 'transparency' : 'general';

    const extension = req.file.originalname.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `${folder}/${timestamp}-${random}.${extension}`;

    const fileUrl = await uploadFile(req.file.buffer, fileName, req.file.mimetype);

    res.json({
      success: true,
      url: fileUrl,
      filename: fileName,
      originalName: req.file.originalname,
    });
  } catch (error: any) {
    console.error('❌ R2 Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message,
    });
  }
});

router.delete('/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    await deleteFile(filename);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error: any) {
    console.error('❌ R2 Delete error:', error);
    res.status(500).json({
      error: 'Delete failed',
      details: error.message,
    });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const files = await listFiles();
    const fileList = files.map((file) => ({
      url: `${process.env.R2_PUBLIC_URL}/${file.Key}`,
      filename: file.Key,
      size: file.Size,
      lastModified: file.LastModified,
    }));

    res.json(fileList);
  } catch (error: any) {
    console.error('❌ R2 List error:', error);
    res.status(500).json({
      error: 'Error getting files',
      details: error.message,
    });
  }
});

export default router;
