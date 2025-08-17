import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import Chat from '../models/chat.model.js';
import {CHAT_USER_FIELDS} from '../socket/constants.js';
import {STATUS_CODES} from '../utils/status-codes.js';

const router = Router();

router.use(userAuth);
router.get('/messages/:receiverId', async (req, res) => {
  const {receiverId} = req.params;
  const currentUserId = res.locals.currentUser._id;

  const chat = await Chat.findOne({
    participants: {
      $all: [currentUserId, receiverId],
    },
  }).populate('messages.senderId', CHAT_USER_FIELDS);

  res.status(STATUS_CODES.OK).json(chat?.messages ?? []);
});

export default router;
