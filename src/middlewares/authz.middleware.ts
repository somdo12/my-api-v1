import { Request, Response, NextFunction } from 'express';

export const requireRole = (requiredRole: number) => {
    return (req: any, res: Response, next: NextFunction) => {
        // 1. ตรวจสอบว่ามีข้อมูลผู้ใช้ใน Request หรือไม่
        if (!req.user || !req.user.userRole) {
            return res.status(401).json({ error: 'Authentication required.' });
        }

        // 2. ตรวจสอบ Role ของผู้ใช้
        if (req.user.userRole !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden: You do not have the required permissions.' });
        }

        // 3. ถ้าสิทธิ์ถูกต้อง ก็ให้ไปต่อ
        next();
    };
};
