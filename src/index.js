import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './config/database.js';
import './config/environment.js';
import authRouter from './routes/auth.router.js';
import requestRouter from './routes/request.router.js';
import userRouter from './routes/user.router.js';
import {genericErrorHandler} from './utils/index.js';

const app = express();

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

connectDB()
  .then(() => {
    console.info('Database connection established');
    if (process.env.NODE_ENV !== 'lambda') {
      const PORT = +(process.env.PORT ?? 3400);
      app.listen(PORT, () => {
        console.info(`The server is running on: ${PORT}`);
      });
    }
  })
  .catch(err => {
    console.error(`Database connection failed: ${err}`);
  });

export default app;
