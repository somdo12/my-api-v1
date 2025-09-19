import { Router } from 'express';
import { createProduct,updateProduct,deleteProduct } from '../controllers/product.controller';
import { createProductLimiter, crudLimiter } from '../middlewares/rate-limit.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/authz.middleware';

const router = Router();

// Endpoint สำหรับการสร้างสินค้า
// - ต้องมี Token ที่ถูกต้อง
// - ต้องมีสิทธิ์เป็น Admin (role 1)
// - ใช้ createProductLimiter เพื่อป้องกันการสร้างสินค้าจำนวนมาก
router.post('/', authenticateToken, requireRole(1), createProductLimiter, createProduct);

// Endpoint สำหรับการแก้ไขข้อมูลสินค้า
// - ต้องมี Token ที่ถูกต้อง
// - ใช้ crudLimiter (limiter ทั่วไปสำหรับ CRUD)
router.put('/:id', authenticateToken, crudLimiter, updateProduct);

// Endpoint สำหรับการลบสินค้า
// - ต้องมี Token ที่ถูกต้อง
// - ต้องมีสิทธิ์เป็น Admin (role 1)
// - ใช้ crudLimiter
router.delete('/:id', authenticateToken, requireRole(1), crudLimiter, deleteProduct);

export default router;
