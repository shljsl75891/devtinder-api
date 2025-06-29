import serverlessExpress from '@codegenie/serverless-express';
import expressApp from './src/app.js';
import connectDB from './src/config/database.js';

let serverlessAppInstance = null;

async function setupApp(event, context) {
  try {
    await connectDB();
    console.info('Database connection established');
    serverlessAppInstance = serverlessExpress({app: expressApp});
    return serverlessAppInstance(event, context);
  } catch (error) {
    console.error(`Database connection failed: ${error}`);
  }
}

export const handler = async (event, context) => {
  if (serverlessAppInstance) {
    return serverlessAppInstance(event, context);
  }
  return setupApp(event, context);
};
