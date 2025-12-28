import { Request, Response, NextFunction } from 'express';

export const requireRole = (requiredRole: number) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || !req.user.userRole) {
            return res.status(401).json({ error: 'Authentication required.' });
        }
        if (req.user.userRole !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden: You do not have the required permissions.' });
        }
        next();
    };
};
