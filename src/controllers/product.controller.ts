import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { 
    createProductSchema, 
    updateProductSchema, 
    productQuerySchema,
    productIdSchema,
} from '../models/product.model';

const prisma = new PrismaClient();



const createProduct = async (req: Request, res: Response) => {
    try {
        const validationResult = createProductSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        const { name, price,typeId, description } = validationResult.data;
        
        const newProduct = await prisma.product.create({
            data: {
                name,
                price,
                ...(description && { description }),
                ...(typeId && { typeId }),
            },
        });
        
        console.log(`✅ Product created: ${newProduct.name} (ID: ${newProduct.id})`);
        res.status(201).json(newProduct);
        
    } catch (error: any) {
        console.error('❌ Error creating product:', error);
        
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Product name already exists.' });
        }
        
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Invalid reference data.' });
        }
        
        return res.status(500).json({ error: 'Failed to create product.' });
    }
};

const getProducts = async (req: Request, res: Response) => {
    try {
        const queryValidation = productQuerySchema.safeParse(req.query);
        if (!queryValidation.success) {
            return res.status(400).json({
                error: 'Invalid query parameters',
                details: queryValidation.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        const { page = 1, limit = 10, search } = queryValidation.data;
        const skip = (page - 1) * limit;
        
        const where = search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { description: { contains: search, mode: 'insensitive' as const } }
            ]
        } : {};
        
        const queryOptions: any = {
            where,
            skip: Math.max(0, skip),
            orderBy: { id: 'desc' }
        };
        
        if (limit > 0) {
            queryOptions.take = limit;
        }
        
        const [products, totalCount] = await Promise.all([
            prisma.product.findMany(queryOptions),
            prisma.product.count({ where })
        ]);
        
        res.status(200).json({
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: limit
            }
        });
        
    } catch (error: any) {
        console.error('❌ Error fetching products:', error);
        return res.status(500).json({ error: 'Failed to fetch products.' });
    }
};

const getProductById = async (req: Request, res: Response) => {
    try {
        const idValidation = productIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Invalid product ID',
                details: idValidation.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        const productId = idValidation.data.id;
        
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        
        res.status(200).json(product);
        
    } catch (error: any) {
        console.error('❌ Error fetching product:', error);
        return res.status(500).json({ error: 'Failed to retrieve product.' });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    try {
        const idValidation = productIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Invalid product ID',
                details: idValidation.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        const productId = idValidation.data.id;
        
        const validationResult = updateProductSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        const { name, price, description,typeId } = validationResult.data;
        if (!name && price === undefined && description === undefined) {
            return res.status(400).json({ error: 'At least one field (name, price, description) is required for update.' });
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        if (description !== undefined) updateData.description = description;
        if (typeId !== undefined) updateData.typeId = typeId; 
        
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updateData,
        });
        
        console.log(`✅ Product updated: ${updatedProduct.name} (ID: ${updatedProduct.id})`);
        res.status(200).json(updatedProduct);
        
    } catch (error: any) {
        console.error('❌ Error updating product:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found.' });
        }
        
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Product name already exists.' });
        }
        
        return res.status(500).json({ error: 'Failed to update product.' });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const idValidation = productIdSchema.safeParse(req.params);
        if (!idValidation.success) {
            return res.status(400).json({
                error: 'Invalid product ID',
                details: idValidation.error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }
        
        const productId = idValidation.data.id;
        
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });
        
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found.' });
        }
        
        await prisma.product.delete({
            where: { id: productId },
        });
        
        console.log(`🗑️ Product deleted: ${existingProduct.name} (ID: ${productId})`);
        res.status(200).json({ 
            message: 'Product deleted successfully.',
            deletedProduct: {
                id: existingProduct.id,
                name: existingProduct.name
            }
        });
        
    } catch (error: any) {
        console.error('❌ Error deleting product:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found.' });
        }
        
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Cannot delete product. It is being used by other records.' });
        }
        
        return res.status(500).json({ error: 'Failed to delete product.' });
    }
};

export { createProduct, getProducts, getProductById, updateProduct, deleteProduct };