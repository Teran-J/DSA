// DSA/backend/src/presentation/routes/authRoutes.ts

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico único del usuario.
 *           example: nuevo.usuario@ejemplo.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           description: Contraseña (mínimo 6 caracteres).
 *           example: supersegura123
 *         name:
 *           type: string
 *           description: Nombre opcional del usuario.
 *           example: Juan Pérez
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario para iniciar sesión.
 *           example: usuario@ejemplo.com
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario.
 *           example: supersegura123
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             name:
 *               type: string
 *         token:
 *           type: string
 *           description: JWT para autenticación.
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Operaciones de registro e inicio de sesión
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente. Devuelve el usuario y el JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: Error de validación (Zod) o el usuario ya existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión del usuario
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso. Devuelve el usuario y el JWT.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '401':
 *         description: Credenciales no válidas (correo o contraseña incorrectos).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '400':
 *         description: Error de validación (Zod).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/login', authController.login);

export default router;
