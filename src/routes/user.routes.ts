import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/authz.middleware'; 
import { generalLimiter, authLimiter, createUserLimiter, crudLimiter } from '../middlewares/rate-limit.middleware';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, changePassword } from '../controllers/user.controller';

const router = Router();

router.post('/sign-in', authLimiter, loginUser); 
router.post('/sign-up', createUserLimiter, createUser); 
router.get('/', generalLimiter, getAllUsers); 
router.get('/:id', generalLimiter, getUserById); 


router.put('/edit-password', crudLimiter, authenticateToken, changePassword); 
router.put('/:id', generalLimiter, authenticateToken, requireRole(1), updateUser); 
router.delete('/:id', generalLimiter, authenticateToken, requireRole(1), deleteUser); 

export default router;