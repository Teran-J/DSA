import { Router } from 'express';
import { DesignController } from '../controllers/DesignController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { Role } from '../../domain/entities/User';

const router = Router();
const designController = new DesignController();

/**
 * @route   POST /designs
 * @desc    Create a new design
 * @access  Private (authenticated users)
 */
router.post('/', authMiddleware, designController.create);

/**
 * @route   GET /designs/:id
 * @desc    Get design by ID
 * @access  Private (owner or designer/admin)
 */
router.get('/:id', authMiddleware, designController.getById);

/**
 * @route   GET /designs/user/me
 * @desc    Get current user's designs
 * @access  Private (authenticated users)
 */
router.get('/user/me', authMiddleware, designController.getUserDesigns);

/**
 * @route   GET /designs/pending/all
 * @desc    Get all pending designs (for designers)
 * @access  Private (designers and admins only)
 */
router.get(
  '/pending/all',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  designController.getPendingDesigns
);

export default router;
