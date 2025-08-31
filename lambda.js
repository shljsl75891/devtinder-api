import {ApiGatewayManagementApiClient} from '@aws-sdk/client-apigatewaymanagementapi';
import serverlessExpress from '@codegenie/serverless-express';
import expressApp from './src/app.js';
import connectDB from './src/config/database.js';
import './src/config/environment.js';
import {isNullOrUndefined} from './src/utils/constants.js';
import {
  onConnect,
  onDisconnect,
  onJoinRoom,
  onSendMessage,
} from './src/utils/socket.js';

let serverlessAppInstance = null;
let dbConnection = null;

async function setupApp(event, context) {
  try {
    serverlessAppInstance = serverlessExpress({app: expressApp});
    return serverlessAppInstance(event, context);
  } catch (error) {
    console.error(`Database connection failed: ${error}`);
  }
}

export const handler = async (event, context) => {
  // keep connections alive between invocations
  context.callbackWaitsForEmptyEventLoop = false;
  if (isNullOrUndefined(dbConnection)) {
    dbConnection = await connectDB();
    console.info('Database connection established');
  } else {
    console.info('Reusing existing database connection');
  }
  if (isNullOrUndefined(event.requestContext?.http)) {
    await handleWebSocketEvent(event, context);
    return {statusCode: 200, body: 'Websocket connection established'};
  }
  if (serverlessAppInstance) {
    return serverlessAppInstance(event, context);
  }
  return setupApp(event, context);
};

async function handleWebSocketEvent(event, context) {
  try {
    const {connectionId, routeKey} = event.requestContext;

    let message = {};
    try {
      message = JSON.parse(event.body).message || {};
    } catch {
      console.warn(`No valid body in ${routeKey} event`);
    }

    const apiGwClient = new ApiGatewayManagementApiClient({
      apiVersion: '2018-11-29',
      endpoint:
        process.env.API_GATEWAY_WEBSOCKET_ENDPOINT ??
        `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
    });

    const handlers = {
      $connect: () => onConnect(connectionId),
      $disconnect: () => onDisconnect(connectionId),
      joinRoom: () => onJoinRoom(connectionId, message, apiGwClient),
      sendMessage: () => onSendMessage(message, apiGwClient),
    };

    if (handlers[routeKey]) {
      await handlers[routeKey]();
    } else {
      console.warn(`Unhandled routeKey: ${routeKey}`);
    }
  } catch (error) {
    console.error('Something went wrong:', error);
  }
}
