import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import designRoutes from './designRoutes';
import reviewRoutes from './reviewRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/designs', designRoutes);
router.use('/reviews', reviewRoutes);
router.use('/upload', uploadRoutes);

export default router;
