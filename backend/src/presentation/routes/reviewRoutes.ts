import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { Role } from '../../domain/entities/User';

const router = Router();
const reviewController = new ReviewController();

/**
 * @route   POST /reviews/:designId/approve
 * @desc    Approve a design
 * @access  Private (designers and admins only)
 */
router.post(
  '/:designId/approve',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  reviewController.approve
);

/**
 * @route   POST /reviews/:designId/reject
 * @desc    Reject a design
 * @access  Private (designers and admins only)
 */
router.post(
  '/:designId/reject',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  reviewController.reject
);

/**
 * @route   GET /reviews/:designId/technical-sheet
 * @desc    Get technical sheet for approved design
 * @access  Private (designers and admins only)
 */
router.get(
  '/:designId/technical-sheet',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  reviewController.getTechnicalSheet
);

export default router;
