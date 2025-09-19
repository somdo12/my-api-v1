import rateLimit from 'express-rate-limit';

// Rate limit ทั่วไปสำหรับทุก API ที่ไม่ได้กำหนดเป็นพิเศษ
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 100, 
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true, // ส่ง rate limit info ใน headers (ตามมาตรฐาน)
    legacyHeaders: false,
});

// Rate limit สำหรับ Login (เข้มงวดกว่า)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 5, 
    message: {
        error: 'Too many login attempts from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // ไม่นับ request ที่สำเร็จ
});

// Rate limit สำหรับการสร้าง User (ป้องกัน spam account)
export const createUserLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
    max: 5, 
    message: {
        error: 'Too many accounts created from this IP, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limit สำหรับการเปลี่ยนรหัสผ่าน
export const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
    max: 10, // จำกัด 5 ครั้งต่อ 1 ชั่วโมง
    message: {
        error: 'Too many password change attempts, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limit สำหรับการสร้าง Product
export const createProductLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
    max: 30, // จำกัด 20 ครั้งต่อ 1 ชั่วโมง
    message: {
        error: 'Too many products created from this IP, please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limit สำหรับ CRUD operations ทั่วไป
export const crudLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 50,
    message: {
        error: 'Too many CRUD operations from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
