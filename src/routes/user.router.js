import bcrypt from 'bcrypt';
import {Router} from 'express';
import {SALT_ROUNDS} from '../constants.js';
import userAuth from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
import {STATUS_CODES} from '../status-codes.js';
import {validateProfileUpdate} from '../utils/index.js';

const userRouter = Router();
userRouter.use(userAuth);

userRouter.get('/feed', async (req, res) => {
  const users = await User.find({}, {__v: 0, password: 0});
  res.status(STATUS_CODES.OK).json(users);
});

userRouter.get('/profile', async (req, res) => {
  res.status(STATUS_CODES.OK).json(res.locals.currentUser);
});

userRouter.patch('/update-profile', async (req, res) => {
  try {
    validateProfileUpdate(req.body);
    const {profileImageUrl, password, skills} = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.findByIdAndUpdate(
      res.locals.currentUser._id,
      {profileImageUrl, password: passwordHash, skills},
      {runValidators: true},
    );
    if (!user)
      res.status(STATUS_CODES.NOT_FOUND).json({message: 'User Not Found'});
    else res.sendStatus(STATUS_CODES.NO_CONTENT);
  } catch (err) {
    res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send({message: err.message});
  }
});

userRouter.delete('/delete-account', async (req, res) => {
  const user = await User.findByIdAndDelete(res.locals.currentUser._id);
  if (!user)
    res.status(STATUS_CODES.NOT_FOUND).json({message: 'User Not Found'});
  else res.sendStatus(STATUS_CODES.NO_CONTENT);
});

export default userRouter;
