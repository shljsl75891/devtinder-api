import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import Request from '../models/request.model.js';
import User from '../models/user.model.js';
import UserValidatorService from '../services/validators/user-validator.service.js';
import {CustomError, STATUS_CODES} from '../utils/index.js';

const userRouter = Router();
const userValidator = new UserValidatorService();
userRouter.use(userAuth);

userRouter.get('/feed', async (req, res) => {
  const users = await User.find({}, {__v: 0, password: 0});
  res.status(STATUS_CODES.OK).json(users);
});

userRouter.get('/profile', async (req, res) => {
  res.status(STATUS_CODES.OK).json(res.locals.currentUser);
});

userRouter.patch('/update-profile', async (req, res) => {
  userValidator.updateProfile(req.body);
  const {gender, age, profileImageUrl, skills} = req.body;
  const user = await User.findByIdAndUpdate(
    res.locals.currentUser._id,
    {gender, age, profileImageUrl, skills},
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

export default userRouter;
