import bcrypt from 'bcrypt';
import express from 'express';
import {SALT_ROUNDS} from '../constants.js';
import User from '../models/user.model.js';
import {STATUS_CODES} from '../status-codes.js';
import {validateUserLogin, validateUserSignup} from '../utils/index.js';

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    validateUserLogin(req.body);
    const {email, password} = req.body;
    const user = await User.findOne({email}, 'email password');
    if (!user) {
      throw new Error('Invalid Credentials');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      res.status(STATUS_CODES.OK).json({
        message: 'You have login successfully',
      });
    } else {
      throw new Error('Invalid Credentials');
    }
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({message: error.message});
  }
});

authRouter.post('/signup', async (req, res) => {
  try {
    validateUserSignup(req.body);
    const {firstName, lastName, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const savedUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    res.status(STATUS_CODES.CREATED).json(savedUser);
  } catch (err) {
    res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send({message: err.message});
  }
});

export default authRouter;
