import 'dotenv/config';
import express from 'express';
import {connectDatabase} from './config/database.js';
import delay from './middlewares/delay.middleware.js';
import authRouter from './routers/auth.router.js';
import pingRouter from './routers/ping.router.js';
import userRouter from './routers/user.router.js';
import {errorHandler} from './utils.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// middlewares
app.use(express.json());
app.use(delay(0));

// routes
app.use('/ping', pingRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

// error handling
app.use('/', errorHandler);

connectDatabase()
  .then(() => {
    console.log('Database connection established');
    app.listen(PORT, () =>
      console.log(`The server is listening on port: ${PORT}`),
    );
  })
  .catch(err => {
    console.log('Database connection failed: ', err);
  });
