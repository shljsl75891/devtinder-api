import {PostToConnectionCommand} from '@aws-sdk/client-apigatewaymanagementapi';
import Chat from '../models/chat.model.js';
import Room from '../models/room.model.js';
import User from '../models/user.model.js';
import {
  getSecretRoomId,
  isNullOrUndefined,
  USER_SAFE_DATA,
} from './constants.js';

/** @param {string} connectionId */
export async function onConnect(connectionId) {
  // nothing yet
}

/** @param {string} connectionId */
export async function onDisconnect(connectionId) {
  await Room.deleteOne({connectionId});
}

/**
 * @param {string} connectionId
 * @param {Record<string, any>} message
 * @param {import('@aws-sdk/client-apigatewaymanagementapi').ApiGatewayManagementApiClient} apiGwClient
 */
export async function onJoinRoom(connectionId, message, apiGwClient) {
  const receiver = await User.findById(message.receiverId, USER_SAFE_DATA);
  const roomId = getSecretRoomId(message.senderId, message.receiverId);

  await Promise.all([
    apiGwClient.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify({event: 'roomJoined', receiver}),
      }),
    ),
    Room.create({roomId, connectionId}),
  ]);
}

/**
 * @param {Record<string, any>} message
 * @param {import('@aws-sdk/client-apigatewaymanagementapi').ApiGatewayManagementApiClient} apiGwClient
 */
export async function onSendMessage(message, apiGwClient) {
  let chat = await Chat.findOne({
    participants: {$all: [message.senderId, message.receiverId]},
  });

  if (isNullOrUndefined(chat)) {
    chat = new Chat({
      participants: [message.senderId, message.receiverId],
      messages: [],
    });
  }

  chat.messages.push({
    senderId: message.senderId,
    content: message.content,
  });

  const [rooms] = await Promise.all([
    Room.find({
      roomId: getSecretRoomId(message.senderId, message.receiverId),
    }),
    chat.populate(
      `messages.${chat.messages.length - 1}.senderId`,
      USER_SAFE_DATA,
    ),
    chat.save(),
  ]);

  await Promise.all(
    rooms.map(({connectionId}) =>
      apiGwClient.send(
        new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: JSON.stringify({
            event: 'messageDelivered',
            message: chat.messages[chat.messages.length - 1],
          }),
        }),
      ),
    ),
  );
}
