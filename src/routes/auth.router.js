import bcrypt from 'bcrypt';
import express from 'express';
import {HALF_HOUR_IN_MILLISECONDS, SALT_ROUNDS} from '../constants.js';
import User from '../models/user.model.js';
import {STATUS_CODES} from '../status-codes.js';
import {validateUserLogin, validateUserSignup} from '../utils/index.js';

const authRouter = express.Router();
const INVALID_CREDENTIALS_ERROR = new Error('Invalid Credentials');

authRouter.post('/login', async (req, res) => {
  try {
    validateUserLogin(req.body);
    const {email, password} = req.body;
    const user = await User.findOne({email}, 'email password');
    if (!user) throw INVALID_CREDENTIALS_ERROR;
    const isPasswordCorrect = await user.validatePassword(password);
    if (isPasswordCorrect) {
      // Expires the cookie one minute before JWT get expired
      const expires = new Date(Date.now() + HALF_HOUR_IN_MILLISECONDS - 60000);
      res.cookie('token', user.createJWT(), {expires});
      res
        .status(STATUS_CODES.OK)
        .json({message: 'You have login successfully'});
    } else throw INVALID_CREDENTIALS_ERROR;
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({message: error.message});
  }
});

authRouter.post('/signup', async (req, res) => {
  try {
    validateUserSignup(req.body);
    const {firstName, lastName, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    res
      .status(STATUS_CODES.CREATED)
      .json({message: 'You have registered successfully'});
  } catch (err) {
    res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send({message: err.message});
  }
});

export default authRouter;
