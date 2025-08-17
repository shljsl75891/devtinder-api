import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import {createServer} from 'node:http';
import './config/environment.js';
import authRouter from './routes/auth.router.js';
import chatRouter from './routes/chat.router.js';
import requestRouter from './routes/request.router.js';
import userRouter from './routes/user.router.js';
import {
  createSocket,
  registerJoinHandler,
  registerSendMessageHandler,
  socketAuth,
} from './socket/index.js';
import {genericErrorHandler} from './utils/index.js';

const app = express();
const server = createServer(app);
const io = createSocket(server);

// Middlewares
app.use(express.json());
app.use(cookieParser());
io.engine.use(cookieParser());
io.use(socketAuth);

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
app.use('/chats', chatRouter);

// Registering handlers
io.on('connection', socket => {
  registerJoinHandler(socket, io);
  registerSendMessageHandler(socket, io);

  socket.on('disconnect', () => {
    console.info(`Socket disconnected: ${socket.id}`);
  });
});

// Error Handling
app.use(genericErrorHandler);

export default server;
