import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        error: 'Too many login attempts from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, 
});

export const createUserLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 5, 
    message: {
        error: 'Too many accounts created from this IP, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    message: {
        error: 'Too many password change attempts, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const createProductLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30, 
    message: {
        error: 'Too many products created from this IP, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const crudLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 50,
    message: {
        error: 'Too many CRUD operations from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
