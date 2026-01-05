import { Request, Response, NextFunction } from 'express';

const authenticateSelf = (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    const userIdFromToken = req.user.userId;
    const userIdFromRequest = req.body.userId;

    if (userIdFromToken !== userIdFromRequest) {
        return res.status(403).json({ error: 'Forbidden: You can only change your own password.' });
    }
    next();
};

export { authenticateSelf };
