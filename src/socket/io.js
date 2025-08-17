import {Server} from 'socket.io';

/** @param {import('node:http').Server} httpServer */
function createSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(','),
      credentials: true,
    },
  });

  return io;
}

export default createSocket;
