import express from 'express';
import connectDB from './config/database.js';
import './config/environment.js';
import userRouter from './routes/user.router.js';
import {STATUS_CODES} from './status-codes.js';

const app = express();
const PORT = +(process.env.PORT ?? 3400);

// Middlewares
app.use(express.json());

// Routes
app.use('/users', userRouter);

// Error Handling
app.use('/', (err, req, res, next) => {
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
});

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
