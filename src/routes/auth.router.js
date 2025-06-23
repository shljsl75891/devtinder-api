import express from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
import AuthValidatorService from '../services/validators/auth-validator.service.js';
import {
  CustomError,
  HALF_HOUR_IN_MILLISECONDS,
  STATUS_CODES,
} from '../utils/index.js';

const authRouter = express.Router();
const authValidator = new AuthValidatorService();
const INVALID_CREDENTIALS_ERROR = new CustomError(
  'Invalid Credentials',
  STATUS_CODES.UNAUTHORIZED,
);

authRouter.post('/login', async (req, res) => {
  authValidator.login(req.body);
  const {email, password} = req.body;
  const user = await User.findOne({email}, 'email password');
  if (!user) throw INVALID_CREDENTIALS_ERROR;
  const isPasswordCorrect = await user.validatePassword(password);
  if (!isPasswordCorrect) throw INVALID_CREDENTIALS_ERROR;
  // Expires the cookie one minute before JWT get expired
  const expires = new Date(Date.now() + HALF_HOUR_IN_MILLISECONDS - 60000);
  res
    .cookie('token', user.createJWT(), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires,
    })
    .status(STATUS_CODES.OK)
    .json({message: 'You have login successfully'});
});

authRouter.post('/signup', async (req, res) => {
  authValidator.signUp(req.body);
  const {firstName, lastName, email, password} = req.body;
  const passwordHash = await User.generatePasswordHash(password);
  await User.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
  });
  res
    .status(STATUS_CODES.CREATED)
    .json({message: 'You have registered successfully'});
});

authRouter.post('/logout', (req, res) => {
  res
    .clearCookie('token', {sameSite: 'none', secure: true, httpOnly: true})
    .status(STATUS_CODES.OK)
    .json({message: 'You have logged out successfully'});
});

authRouter.use(userAuth);
authRouter.patch('/forgot-password', async (req, res) => {
  const currentUser = res.locals.currentUser;
  authValidator.forgotPassword(req.body);
  const {currentPassword, newPassword} = req.body;
  const user = await User.findById(currentUser._id, 'password');
  const isCurrentPasswordCorrect = await user.validatePassword(currentPassword);
  if (!isCurrentPasswordCorrect) {
    throw INVALID_CREDENTIALS_ERROR;
  }
  const passwordHash = await User.generatePasswordHash(newPassword);
  await User.findByIdAndUpdate(currentUser._id, {password: passwordHash});
  res
    .status(STATUS_CODES.NO_CONTENT)
    .json({message: 'Password updated successfully'});
});

export default authRouter;
