import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {createServer} from 'node:http';
import './config/environment.js';
import createSocket from './config/socket.js';
import authRouter from './routes/auth.router.js';
import requestRouter from './routes/request.router.js';
import userRouter from './routes/user.router.js';
import {genericErrorHandler} from './utils/index.js';

const app = express();
const server = createServer(app);

// Middlewares
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== 'lambda') {
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS?.split(','),
      credentials: true,
    }),
  );
}

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/requests', requestRouter);

// Error Handling
app.use(genericErrorHandler);
createSocket(server);

export default server;
