import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
import UserValidatorService from '../services/validators/user-validator.service.js';
import {STATUS_CODES} from '../utils/index.js';

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
  try {
    userValidator.updateProfile(req.body);
    const {profileImageUrl, skills} = req.body;
    const user = await User.findByIdAndUpdate(
      res.locals.currentUser._id,
      {profileImageUrl, skills},
      {runValidators: true},
    );
    if (!user)
      res.status(STATUS_CODES.NOT_FOUND).json({message: 'User Not Found'});
    else res.sendStatus(STATUS_CODES.NO_CONTENT);
  } catch (err) {
    res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).json({message: err.message});
  }
});

userRouter.delete('/delete-account', async (req, res) => {
  const user = await User.findByIdAndDelete(res.locals.currentUser._id);
  if (!user)
    res.status(STATUS_CODES.NOT_FOUND).json({message: 'User Not Found'});
  else res.sendStatus(STATUS_CODES.NO_CONTENT);
});

export default userRouter;
