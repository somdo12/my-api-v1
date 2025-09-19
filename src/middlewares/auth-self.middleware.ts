import { Request, Response, NextFunction } from 'express';

const authenticateSelf = (req: any, res: Response, next: NextFunction) => {
    // 1. ตรวจสอบว่ามีข้อมูลผู้ใช้ใน Token และมี userId
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const userIdFromToken = req.user.userId;
    const userIdFromRequest = req.body.userId; // สมมติว่า userId ถูกส่งมาใน body

    // 2. ตรวจสอบว่า userId ใน Token ตรงกับ userId ที่ต้องการแก้ไขหรือไม่
    if (userIdFromToken !== userIdFromRequest) {
        return res.status(403).json({ error: 'Forbidden: You can only change your own password.' });
    }

    // 3. ถ้าตรงกัน ก็ให้ไปต่อ
    next();
};

export { authenticateSelf };
