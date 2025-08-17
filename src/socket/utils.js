import {createHash} from 'node:crypto';
/**
 * Creates a secret room ID based on the sender and receiver IDs.
 *
 * @param {string} senderId - The ID of the sender.
 * @param {string} receiverId - The ID of the receiver.
 * @returns {string} - The generated room ID.
 */
export const getSecretRoomId = (senderId, receiverId) => {
  return createHash('sha256')
    .update([senderId, receiverId].sort().join('-'), 'utf8')
    .digest('hex');
};
