import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

/**
 * @route   GET /products
 * @desc    Get all products (with optional category filter)
 * @access  Public
 * @query   category - Filter by category (optional)
 */
router.get('/', productController.getAll);

/**
 * @route   GET /products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productController.getById);

export default router;
