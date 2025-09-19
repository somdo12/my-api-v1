// import { Request, Response } from 'express';
// import { PrismaClient } from '../generated/prisma';

// const prisma = new PrismaClient();

// // ฟังก์ชันสำหรับสร้างสินค้าใหม่
// const createProduct = async (req: Request, res: Response) => {
//     // TODO: เพิ่ม logic สำหรับการสร้างสินค้าที่นี่
//     // ตัวอย่าง:
//     // const { name, price } = req.body;
//     // const newProduct = await prisma.product.create({
//     //     data: {
//     //         name,
//     //         price,
//     //     },
//     // });
//     res.status(201).json({ message: 'Product created successfully.' });
// };

// // ฟังก์ชันสำหรับดูสินค้าทั้งหมด
// const getAllProducts = async (req: Request, res: Response) => {
//     try {
//         // TODO: เพิ่ม logic สำหรับการดึงข้อมูลสินค้าทั้งหมดที่นี่
//         const allProducts = await prisma.product.findMany();
//         res.status(200).json(allProducts);
//     } catch (e: any) {
//         return res.status(500).json({ error: 'Something went wrong.' });
//     }
// };

// // ฟังก์ชันสำหรับอัปเดตข้อมูลสินค้า
// const updateProduct = async (req: Request, res: Response) => {
//     // TODO: เพิ่ม logic สำหรับการอัปเดตสินค้าที่นี่
//     // ตัวอย่าง:
//     // const productId = req.params.id;
//     // const { name, price } = req.body;
//     // await prisma.product.update({
//     //     where: { id: Number(productId) },
//     //     data: { name, price },
//     // });
//     res.status(200).json({ message: 'Product updated successfully.' });
// };

// // ฟังก์ชันสำหรับลบสินค้า
// const deleteProduct = async (req: Request, res: Response) => {
//     // TODO: เพิ่ม logic สำหรับการลบสินค้าที่นี่
//     // ตัวอย่าง:
//     // const productId = req.params.id;
//     // await prisma.product.delete({
//     //     where: { id: Number(productId) },
//     // });
//     res.status(200).json({ message: 'Product deleted successfully.' });
// };

// export { createProduct, getAllProducts, updateProduct, deleteProduct };
import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// ฟังก์ชันสำหรับสร้างสินค้าใหม่
const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, price, description } = req.body;
        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                description,
            },
        });
        res.status(201).json(newProduct);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create product.' });
    }
};

// ฟังก์ชันสำหรับดูสินค้าทั้งหมด
const getAllProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await prisma.product.findMany();
        res.status(200).json(allProducts);
    } catch (e: any) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

// ฟังก์ชันสำหรับอัปเดตข้อมูลสินค้า
const updateProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required.' });
        }
        const { name, price, description } = req.body;
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(productId) },
            data: { name, price, description },
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update product.' });
    }
};

// ฟังก์ชันสำหรับลบสินค้า
const deleteProduct = async (req: Request, res: Response) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required.' });
        }
        await prisma.product.delete({
            where: { id: parseInt(productId) },
        });
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete product.' });
    }
};

export { createProduct, getAllProducts, updateProduct, deleteProduct };