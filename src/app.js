import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import './config/environment.js';
import authRouter from './routes/auth.router.js';
import chatRouter from './routes/chat.router.js';
import requestRouter from './routes/request.router.js';
import userRouter from './routes/user.router.js';
import {genericErrorHandler} from './utils/index.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  }),
);

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/requests', requestRouter);
app.use('/chats', chatRouter);

// Error Handling
app.use(genericErrorHandler);

export default app;
