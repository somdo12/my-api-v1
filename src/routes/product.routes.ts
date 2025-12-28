import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { createProductLimiter, crudLimiter, generalLimiter } from '../middlewares/rate-limit.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/authz.middleware';

const router = Router();

router.get('/', generalLimiter, getProducts);
router.get('/:id', generalLimiter, getProductById);
router.post('/', authenticateToken, requireRole(1), createProductLimiter, createProduct);
router.delete('/:id', authenticateToken, requireRole(1), crudLimiter, deleteProduct);
router.put('/:id', authenticateToken, crudLimiter, updateProduct);

export default router;