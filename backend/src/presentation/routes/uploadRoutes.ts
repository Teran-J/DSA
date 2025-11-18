import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();
const uploadController = new UploadController();

/**
 * @swagger
 * tags:
 *   - name: Files
 *     description: Operaciones de subida y gestión de archivos.
 *
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           format: url
 *           description: URL pública donde se puede acceder al archivo.
 *           example: "http://localhost:3000/uploads/imagen-ejemplo-12345.jpg"
 *         filename:
 *           type: string
 *           description: Nombre del archivo guardado en el servidor.
 *           example: "imagen-ejemplo-12345.jpg"
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Subir un archivo (imagen)
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir (multipart/form-data). Nombre del campo debe ser 'file'.
 *     responses:
 *       '200':
 *         description: Archivo subido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       '400':
 *         description: Solicitud inválida (ej. no se envió archivo, validación fallida).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '401':
 *         description: No autorizado (falta de token o token inválido).
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/', authMiddleware, upload.single('file'), uploadController.upload);

export default router;
