import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/authz.middleware'; 
import { generalLimiter, authLimiter, createUserLimiter, crudLimiter } from '../middlewares/rate-limit.middleware';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, changePassword } from '../controllers/user.controller';

const router = Router();

// Endpoints สาธารณะ (ไม่ต้องใช้ JWT)
router.post('/sign-in', authLimiter, loginUser); 
router.post('/sign-up', createUserLimiter, createUser); 
router.get('/', generalLimiter, getAllUsers); 
router.get('/:id', generalLimiter, getUserById); 


// API เปลี่ยนรหัสผ่านของผู้ใช้เอง
router.put('/edit-password', crudLimiter, authenticateToken, changePassword); 


// API แก้ไขผู้ใช้
router.put('/:id', generalLimiter, authenticateToken, requireRole(1), updateUser); 
// API ลบผู้ใช้
router.delete('/:id', generalLimiter, authenticateToken, requireRole(1), deleteUser); 

export default router;