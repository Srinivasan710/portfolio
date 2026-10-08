import { Router } from 'express';
import { UploadController, uploadMiddleware } from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Allow authenticated upload
router.post('/', requireAuth, uploadMiddleware.single('file'), UploadController.uploadFile);

export default router;
