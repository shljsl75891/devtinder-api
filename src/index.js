import connectDB from './config/database.js';
import server from './server.js';

if (process.env.NODE_ENV !== 'lambda') {
  connectDB()
    .then(() => {
      console.info('Database connection established');
      const PORT = +(process.env.PORT ?? 3400);
      server.listen(PORT, () => {
        console.info(`The server is running on: ${PORT}`);
      });
    })
    .catch(err => {
      console.error(`Database connection failed: ${err}`);
    });
}
