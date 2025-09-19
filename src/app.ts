import express, { type Express } from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma';
import productRouter from './routes/product.routes';
import userRouter from './routes/user.routes'; 

const prisma = new PrismaClient();
const app: Express = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);


export default app;
