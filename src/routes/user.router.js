import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import Request from '../models/request.model.js';
import User from '../models/user.model.js';
import UserValidatorService from '../services/validators/user-validator.service.js';
import {CustomError, STATUS_CODES, USER_SAFE_DATA} from '../utils/index.js';

const userRouter = Router();
const userValidator = new UserValidatorService();
userRouter.use(userAuth);

userRouter.get('/feed', async (req, res) => {
  const currentUserId = res.locals.currentUser._id.toString();
  const offset = req.query.skip ? +req.query.skip : 0;
  const limit = req.query.limit ? +req.query.limit : 5;
  const requests = await Request.find(
    {$or: [{sender: currentUserId}, {receiver: currentUserId}]},
    'sender receiver',
  );

  const feedUsers = await User.find(
    {
      _id: {
        $nin: Array.from(
          requests.reduce(
            (userIds, request) => {
              userIds.add(request.sender.toString());
              userIds.add(request.receiver.toString());
              return userIds;
            },
            new Set([currentUserId]),
          ),
        ),
      },
    },
    USER_SAFE_DATA,
  )
    .skip(offset)
    .limit(limit);

  res.status(STATUS_CODES.OK).json(feedUsers);
});

userRouter.get('/profile', async (req, res) => {
  res.status(STATUS_CODES.OK).json(res.locals.currentUser);
});

userRouter.patch('/update-profile', async (req, res) => {
  userValidator.updateProfile(req.body);
  const {gender, age, profileImageUrl, skills, about} = req.body;
  const user = await User.findByIdAndUpdate(
    res.locals.currentUser._id,
    {gender, age, profileImageUrl, skills, about},
    {returnDocument: 'after', runValidators: true},
  );
  res.status(STATUS_CODES.OK).json(user);
});

userRouter.delete('/delete-account', async (req, res) => {
  const currentUser = res.locals.currentUser._id;
  await Request.deleteMany({
    $or: [{sender: currentUser._id}, {receiver: currentUser._id}],
  });
  const user = await User.findByIdAndDelete(currentUser._id);
  if (!user)
    throw new CustomError("User doesn't exists", STATUS_CODES.NOT_FOUND);
  res.sendStatus(STATUS_CODES.NO_CONTENT);
});

userRouter.get('/connections', async (req, res) => {
  const currentUserId = res.locals.currentUser._id.toString();
  const connections = await Request.findConnections(currentUserId);
  res.status(STATUS_CODES.OK).json(connections);
});

export default userRouter;
