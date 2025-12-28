
import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response) => {
    const { user_name, user_email, user_password, user_role } = req.body;
    if (!user_email || !user_password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const hashedPassword = await argon2.hash(user_password);
        const newUser = await prisma.user.create({
            data: {
                user_name,
                user_email,
                user_password: hashedPassword,
                user_role: Number(user_role),
            },
        });
        res.status(201).json(newUser);
    } catch (e: any) {
        if (e.code === 'P2002') {
            return res.status(409).json({ error: 'Email already in use.' });
        }
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany();
        res.status(200).json(allUsers);
    } catch (e: any) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

// API: ดึงผู้ใช้รายคน
const getUserById = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (e: any) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

// API: แก้ไขผู้ใช้
const updateUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { user_name, user_email, user_role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: {
                user_name,
                user_email,
                user_role: Number(user_role)
            },
        });
        res.status(200).json(updatedUser);
    } catch (e: any) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

// API: ลบผู้ใช้
const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        await prisma.user.delete({
            where: {
                id: Number(userId),
            },
        });
        res.status(204).send();
    } catch (e: any) {
        if (e.code === 'P2025') {
            return res.status(404).json({ error: 'User not found.' });
        }
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { user_email, user_password } = req.body;
    if (!user_email || !user_password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { user_email } });
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const passwordMatch = await argon2.verify(user.user_password, user_password);
        if (!passwordMatch) return res.status(401).json({ error: 'Incorrect password.' });

        const token = jwt.sign({ userId: user.id, userRole: user.user_role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        return res.status(200).json({ token });
    } catch (e: any) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }
};

const changePassword = async (req: any, res: Response) => {
    const { old_password, new_password } = req.body;
    const userId = req.user.userId;

    if (!old_password || !new_password) {
        return res.status(400).json({ error: 'Old password and new password are required.' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // เพิ่ม console.log นี้เพื่อตรวจสอบค่าในฐานข้อมูล
        console.log('Password in database:', user.user_password);
        console.log('Old password from Postman:', old_password);

        const passwordMatch = await argon2.verify(user.user_password, old_password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect old password.' });
        }

        const newHashedPassword = await argon2.hash(new_password);
        await prisma.user.update({
            where: { id: userId },
            data: { user_password: newHashedPassword },
        });
        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (e: any) {
        console.error(e);
        return res.status(500).json({ error: 'An unexpected error occurred. Please check the server logs for details.' });
    }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser, changePassword };
