import serverlessExpress from '@codegenie/serverless-express';
import expressApp from './src/index.js';

export const handler = serverlessExpress({app: expressApp});
