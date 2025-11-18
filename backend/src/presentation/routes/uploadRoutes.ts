import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();
const uploadController = new UploadController();

/**
 * @route   POST /upload
 * @desc    Upload an image file
 * @access  Private (authenticated users)
 */
router.post('/', authMiddleware, upload.single('file'), uploadController.upload);

export default router;
