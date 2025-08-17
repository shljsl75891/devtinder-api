import {model, Schema} from 'mongoose';

const messageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {timestamps: true},
);

const chatSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  messages: [messageSchema],
});

const Chat = model('Chat', chatSchema);
export default Chat;
