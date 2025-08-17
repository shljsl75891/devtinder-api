import {Socket} from 'socket.io';
import User from '../../models/user.model.js';
import {USER_SAFE_DATA} from '../../utils/constants.js';
import {getSecretRoomId} from '../utils.js';

/**
 * @param {Socket} socket - The socket instance for the user.
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 */
function registerJoinHandler(socket, io) {
  socket.on('join', async ({senderId, receiverId}) => {
    const roomId = getSecretRoomId(senderId, receiverId);
    const receiver = await User.findById(receiverId, USER_SAFE_DATA);

    socket.emit('joinedRoom', {receiver});
    socket.join(roomId);
  });
}

export default registerJoinHandler;
