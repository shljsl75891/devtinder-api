import bcrypt from 'bcrypt';
import {Router} from 'express';
import User from '../models/user.model.js';
import {STATUS_CODES} from '../status-codes.js';
import {
  validateUserSignup,
  validateUserUpdate,
} from '../utils/validations/user.validation.js';

const userRouter = Router();
const SALT_ROUNDS = 10;

userRouter.post('/signup', async (req, res) => {
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

userRouter.get('/', async (req, res) => {
  const users = await User.find();
  res.status(STATUS_CODES.OK).json(users);
});

userRouter.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    res.status(STATUS_CODES.NOT_FOUND).json({message: 'User Not Found'});
  else res.status(STATUS_CODES.OK).json(user);
});

userRouter.patch('/:id', async (req, res) => {
  try {
    validateUserUpdate(req.body);
    const {profileImageUrl, password, skills} = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.findByIdAndUpdate(
      req.params.id,
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

userRouter.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    res.status(STATUS_CODES.NOT_FOUND).json({message: 'User Not Found'});
  else res.sendStatus(STATUS_CODES.NO_CONTENT);
});

export default userRouter;
