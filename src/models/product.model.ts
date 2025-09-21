import { z } from 'zod';

// ⭐ Schema สำหรับการสร้างสินค้า
export const createProductSchema = z.object({
    name: z.string()
        .min(1, { message: "Product name is required and cannot be empty" })
        .max(100, { message: "Product name must be less than 100 characters" })
        .trim(),
    
    price: z.number()
        .int({ message: "Price must be an integer" })
        .positive({ message: "Price must be greater than 0" })
        .max(100000000, { message: "Price is too high (max: 100,000,000)" }),
    
    description: z.string()
        .max(500, { message: "Description must be less than 500 characters" })
        .trim()
        .optional()
        .nullable(),
    
    // ⭐ เพิ่ม field ใหม่: typeId
    typeId: z.number()
        .int({ message: "Product type ID must be an integer" })
        .positive({ message: "Product type ID must be greater than 0" })
        .optional()
        .nullable()
});

// ⭐ Schema สำหรับการอัปเดตสินค้า (ทุกฟิลด์เป็น optional)
export const updateProductSchema = z.object({
    name: z.string()
        .min(1, { message: "Product name cannot be empty" })
        .max(100, { message: "Product name must be less than 100 characters" })
        .trim()
        .optional(),
        
    price: z.number()
        .int({ message: "Price must be an integer" })
        .positive({ message: "Price must be greater than 0" }) // ຕ້ອງຫຼາຍກວ່າ 0
        .max(100000000, { message: "Price is too high (max: 100,000,000)" })
        .optional(),
        
    description: z.string()
        .max(500, { message: "Description must be less than 500 characters" })
        .trim()
        .optional() // ໃສ່ບໍ່ໃສ່ກະໄດ້
        .nullable(),// ອະນູຍາດໃຫ້ເປ໊ນຄ່າວ່າງ
        
    // ⭐ เพิ่ม field ใหม่: typeId
    typeId: z.number()
        .int({ message: "Product type ID must be an integer" })
        .positive({ message: "Product type ID must be greater than 0" })
        .optional()
        .nullable()
});

// ⭐ Schema สำหรับ Query Parameters
export const productQuerySchema = z.object({
    page: z.string()
        .regex(/^\d+$/, "Page must be a positive number")
        .transform(val => parseInt(val))
        .refine(val => val > 0, "Page must be greater than 0")
        .optional(),
        
    limit: z.string()
        .regex(/^\d+$/, "Limit must be a positive number")
        .transform(val => parseInt(val))
        .refine(val => val > 0 && val <= 100, "Limit must be between 1-100")
        .optional(),
        
    search: z.string()
        .max(50, "Search query too long")
        .trim()
        .optional()
});

// ⭐ Schema สำหรับ Product ID
export const productIdSchema = z.object({
    id: z.string()
        .regex(/^\d+$/, "Product ID must be a positive number")
        .transform(val => parseInt(val))
        .refine(val => val > 0, "Product ID must be greater than 0")
});

// ⭐ Export Types สำหรับ TypeScript
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type ProductIdInput = z.infer<typeof productIdSchema>;