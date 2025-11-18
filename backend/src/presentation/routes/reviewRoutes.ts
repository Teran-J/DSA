// DSA/backend/src/presentation/routes/reviewRoutes.ts

import { Router } from 'express';
import { ReviewController } from '../controllers/ReviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { Role } from '../../domain/entities/User';

const router = Router();
const reviewController = new ReviewController();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReviewAction:
 *       type: object
 *       properties:
 *         designId:
 *           type: integer
 *           description: ID del diseño revisado.
 *           example: 101
 *         status:
 *           type: string
 *           enum: [APPROVED, REJECTED]
 *           description: Nuevo estado del diseño.
 *           example: APPROVED
 *         reviewedAt:
 *           type: string
 *           format: date-time
 *           description: Marca de tiempo de la revisión.
 *           example: "2025-11-19T10:00:00.000Z"
 *
 *     ApproveRequest:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *           description: Comentario opcional del revisor.
 *           example: "Aprobado, excelente uso del color."
 *
 *     RejectRequest:
 *       type: object
 *       required: [comment]
 *       properties:
 *         comment:
 *           type: string
 *           description: Razón obligatoria para el rechazo.
 *           example: "Rechazado, la imagen no cumple con la resolución mínima."
 *
 *     TechnicalSheet:
 *       type: object
 *       properties:
 *         designId:
 *           type: integer
 *           example: 101
 *         productId:
 *           type: integer
 *           example: 42
 *         dimensions:
 *           type: string
 *           example: "800x600 pixels"
 *         materials:
 *           type: array
 *           items:
 *             type: string
 *           example: ["PLA", "Cerámica"]
 *         transforms:
 *           $ref: '#/components/schemas/Transforms'
 *
 * tags:
 *   - name: Reviews
 *     description: Operaciones de revisión de diseños (Aprobación/Rechazo)
 */

/**
 * @swagger
 * /reviews/{designId}/approve:
 *   post:
 *     summary: Aprueba un diseño
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: designId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diseño a aprobar.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveRequest'
 *     responses:
 *       '200':
 *         description: Diseño aprobado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewAction'
 *       '400':
 *         description: Error de validación (Zod), diseño ya revisado o error de negocio.
 *       '401':
 *         description: No autorizado (token faltante o inválido).
 *       '403':
 *         description: Prohibido (se requiere rol DESIGNER o ADMIN).
 *       '500':
 *         description: Error interno del servidor.
 */
router.post(
  '/:designId/approve',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  reviewController.approve
);

/**
 * @swagger
 * /reviews/{designId}/reject:
 *   post:
 *     summary: Rechaza un diseño
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: designId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diseño a rechazar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectRequest'
 *     responses:
 *       '200':
 *         description: Diseño rechazado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewAction'
 *       '400':
 *         description: Error de validación (Zod), diseño ya revisado o error de negocio.
 *       '401':
 *         description: No autorizado (token faltante o inválido).
 *       '403':
 *         description: Prohibido (se requiere rol DESIGNER o ADMIN).
 *       '500':
 *         description: Error interno del servidor.
 */
router.post(
  '/:designId/reject',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  reviewController.reject
);

/**
 * @swagger
 * /reviews/{designId}/technical-sheet:
 *   get:
 *     summary: Obtiene la hoja técnica de un diseño aprobado
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: designId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diseño para generar la hoja técnica.
 *     responses:
 *       '200':
 *         description: Hoja técnica recuperada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TechnicalSheet'
 *       '400':
 *         description: Error de negocio (ej: el diseño no está aprobado).
 *       '401':
 *         description: No autorizado (token faltante o inválido).
 *       '403':
 *         description: Prohibido (se requiere rol DESIGNER o ADMIN).
 *       '500':
 *         description: Error interno del servidor.
 */
router.get(
  '/:designId/technical-sheet',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  reviewController.getTechnicalSheet
);

export default router;
