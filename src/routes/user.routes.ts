import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/authz.middleware'; 
import { generalLimiter, authLimiter, createUserLimiter, crudLimiter } from '../middlewares/rate-limit.middleware';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, changePassword } from '../controllers/user.controller';

export const userRouter = Router();


userRouter.post('/sign-in', authLimiter, loginUser); 
userRouter.post('/sign-up', createUserLimiter, createUser); 
userRouter.get('/', generalLimiter, getAllUsers); 
userRouter.get('/:id', generalLimiter, getUserById); 


userRouter.put('/edit-password', crudLimiter, authenticateToken, changePassword); 
userRouter.put('/:id', generalLimiter, authenticateToken, requireRole(1), updateUser); 
userRouter.delete('/:id', generalLimiter, authenticateToken, requireRole(1), deleteUser); 

// export default router;