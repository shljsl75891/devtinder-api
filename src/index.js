import app from './app.js';
import connectDB from './config/database.js';

if (process.env.NODE_ENV !== 'lambda') {
  connectDB()
    .then(async () => {
      console.info('Database connection established');
      const PORT = +(process.env.PORT ?? 3400);
      app.listen(PORT, () => {
        console.info(`The server is running on: ${PORT}`);
      });
    })
    .catch(err => {
      console.error(`Database connection failed: ${err}`);
    });
}
