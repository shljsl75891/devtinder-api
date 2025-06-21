import cookieParser from 'cookie-parser';
import express from 'express';
import connectDB from './config/database.js';
import './config/environment.js';
import authRouter from './routes/auth.router.js';
import requestRouter from './routes/request.router.js';
import userRouter from './routes/user.router.js';
import {genericErrorHandler} from './utils/index.js';

const app = express();
const PORT = +(process.env.PORT ?? 3400);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/requests', requestRouter);

// Error Handling
app.use('/', genericErrorHandler);

connectDB()
  .then(() => {
    console.info('Database connection established');
    app.listen(PORT, () => {
      console.info(`The server is running on: ${PORT}`);
    });
  })
  .catch(err => {
    console.error(`Database connection failed: ${err}`);
  });
