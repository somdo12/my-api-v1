import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Unauthorized

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in .env file.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

const requireRole = (role: number) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (req.user && req.user.userRole === role) {
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: You do not have the required permissions.' });
        }
    };
};

export { authenticateToken, requireRole };
