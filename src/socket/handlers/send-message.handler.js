import {Socket} from 'socket.io';
import Chat from '../../models/chat.model.js';
import {isNullOrUndefined} from '../../utils/index.js';
import {CHAT_USER_FIELDS} from '../constants.js';
import {getSecretRoomId} from '../utils.js';

/**
 * @param {Socket} socket - The socket instance for the user.
 * @param {import('socket.io').Server} io - The Socket.IO server instance.
 */
function registerSendMessageHandler(socket, io) {
  socket.on('sendMessage', async ({senderId, receiverId, content}) => {
    const roomId = getSecretRoomId(senderId, receiverId);
    let chat = await Chat.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (isNullOrUndefined(chat)) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    chat.messages.push({senderId, content});
    await chat.save();

    await chat.populate(
      `messages.${chat.messages.length - 1}.senderId`,
      CHAT_USER_FIELDS,
    );
    const savedMessage = chat.messages[chat.messages.length - 1];
    io.to(roomId).emit('receiveMessage', savedMessage);
  });
}

export default registerSendMessageHandler;
