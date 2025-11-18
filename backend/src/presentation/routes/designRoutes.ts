// DSA/backend/src/presentation/routes/designRoutes.ts

import { Router } from 'express';
import { DesignController } from '../controllers/DesignController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { Role } from '../../domain/entities/User';

const router = Router();
const designController = new DesignController();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Vector3:
 *       type: object
 *       required: [x, y, z]
 *       properties:
 *         x:
 *           type: number
 *           format: float
 *           example: 1.5
 *         y:
 *           type: number
 *           format: float
 *           example: 0.0
 *         z:
 *           type: number
 *           format: float
 *           example: -2.3
 *
 *     Transforms:
 *       type: object
 *       required: [position, rotation, scale]
 *       properties:
 *         position:
 *           $ref: '#/components/schemas/Vector3'
 *         rotation:
 *           $ref: '#/components/schemas/Vector3'
 *         scale:
 *           $ref: '#/components/schemas/Vector3'
 *
 *     DesignCreate:
 *       type: object
 *       required: [productId, color, imageUrl, transforms]
 *       properties:
 *         productId:
 *           type: integer
 *           description: ID del producto base.
 *           example: 42
 *         color:
 *           type: string
 *           description: Código o nombre del color principal.
 *           example: "#FF5733"
 *         imageUrl:
 *           type: string
 *           format: url
 *           description: URL de previsualización del diseño.
 *           example: "https://example.com/design/preview.jpg"
 *         transforms:
 *           $ref: '#/components/schemas/Transforms'
 *
 *     DesignSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *           example: PENDING
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-18T20:00:00.000Z"
 *
 *     DesignDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/DesignSummary'
 *         - type: object
 *           properties:
 *             productId:
 *               type: integer
 *               example: 42
 *             color:
 *               type: string
 *               example: "#FF5733"
 *             imageUrl:
 *               type: string
 *               format: url
 *               example: https://example.com/design/preview.jpg
 *             transforms:
 *               $ref: '#/components/schemas/Transforms'
 *             userId:
 *               type: string
 *
 * tags:
 *   - name: Designs
 *     description: Operaciones relacionadas con la gestión de diseños de usuario.
 */

/**
 * @swagger
 * /designs:
 *   post:
 *     summary: Crea un nuevo diseño
 *     tags:
 *       - Designs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DesignCreate'
 *     responses:
 *       '201':
 *         description: Diseño creado exitosamente. Devuelve un resumen.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       '400':
 *         description: Error de validación o datos inválidos.
 *       '401':
 *         description: No autorizado (token faltante o inválido).
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/', authMiddleware, designController.create);

/**
 * @swagger
 * /designs/{id}:
 *   get:
 *     summary: Obtiene un diseño por ID
 *     tags:
 *       - Designs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del diseño a obtener.
 *     responses:
 *       '200':
 *         description: Diseño recuperado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DesignDetail'
 *       '401':
 *         description: No autorizado.
 *       '403':
 *         description: Prohibido (no tiene permisos).
 *       '404':
 *         description: Diseño no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/:id', authMiddleware, designController.getById);

/**
 * @swagger
 * /designs/user/me:
 *   get:
 *     summary: Obtiene todos los diseños del usuario autenticado
 *     tags:
 *       - Designs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de diseños del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 designs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DesignDetail'
 *                 total:
 *                   type: integer
 *       '401':
 *         description: No autorizado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/user/me', authMiddleware, designController.getUserDesigns);

/**
 * @swagger
 * /designs/pending/all:
 *   get:
 *     summary: Obtiene todos los diseños con estado PENDING
 *     description: Solo accesible para usuarios con rol DESIGNER o ADMIN.
 *     tags:
 *       - Designs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de diseños pendientes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 designs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DesignDetail'
 *                 total:
 *                   type: integer
 *       '401':
 *         description: No autorizado.
 *       '403':
 *         description: Prohibido.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get(
  '/pending/all',
  authMiddleware,
  requireRole(Role.DESIGNER, Role.ADMIN),
  designController.getPendingDesigns
);

export default router;
