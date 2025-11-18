// DSA/backend/src/presentation/routes/productRoutes.ts

import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del producto.
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del producto.
 *           example: Taza de Cerámica
 *         description:
 *           type: string
 *           description: Descripción detallada del producto.
 *           example: Una taza de alta calidad apta para microondas.
 *         category:
 *           type: string
 *           description: Categoría del producto.
 *           example: Hogar
 *         basePrice:
 *           type: number
 *           format: float
 *           description: Precio base para la personalización.
 *           example: 12.99
 *         imageUrl:
 *           type: string
 *           format: url
 *           description: URL de la imagen principal del producto.
 *           example: "https://example.com/images/mug.png"
 *
 * tags:
 *   - name: Products
 *     description: Operaciones de consulta de productos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtener todos los productos (con filtro opcional)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filtrar productos por categoría.
 *         example: Ropa
 *     responses:
 *       '200':
 *         description: Lista de productos recuperada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   example: 15
 *       '400':
 *         description: Error en la petición (ej. filtro inválido).
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', productController.getAll);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a obtener.
 *         example: 5
 *     responses:
 *       '200':
 *         description: Producto recuperado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/:id', productController.getById);

export default router;
