import cookieParser from 'cookie-parser';
import {createHash} from 'node:crypto';
import {Server} from 'socket.io';
import User from '../models/user.model.js';
import {USER_SAFE_DATA} from '../utils/constants.js';

/**
 * Creates a secret room ID based on the sender and receiver IDs.
 *
 * @param {string} senderId - The ID of the sender.
 * @param {string} receiverId - The ID of the receiver.
 * @returns {string} - The generated room ID.
 */
const getSecretRoomId = (senderId, receiverId) => {
  return createHash('sha256')
    .update([senderId, receiverId].sort().join('-'), 'utf8')
    .digest('hex');
};

/** @param {import('node:http').Server} httpServer */
function createSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(','),
      credentials: true,
    },
  });

  io.engine.use(cookieParser());
  io.use((socket, next) => {
    // @ts-expect-error - cookie-parser attaches cookies to request
    const token = socket.request.cookies?.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }
    User.verifyJwt(token)
      .then(() => next())
      .catch(err => next(err));
  });

  io.on('connection', socket => {
    socket.on('join', async ({senderId, receiverId}) => {
      const roomId = getSecretRoomId(senderId, receiverId);
      const receiver = await User.findById(receiverId, USER_SAFE_DATA);

      socket.emit('joinedRoom', {receiver});
      socket.join(roomId);
    });

    socket.on('sendMessage', ({senderId, receiverId, content}) => {
      const roomId = getSecretRoomId(senderId, receiverId);
      io.to(roomId).emit('receiveMessage', {senderId, receiverId, content});
    });
  });
}

export default createSocket;
