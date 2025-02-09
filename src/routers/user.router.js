import {Router} from 'express';
import {INVALID_PAYLOAD_ERR} from '../constants.js';
import User from '../models/user.model.js';
import {
  errorResponse,
  isNullOrUndefined,
  isNullOrUndefinedOrEmpty,
  notFoundErr,
  successResponse,
} from '../utils.js';

const router = Router();

router.get('/feed', async (_, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(successResponse(users));
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (isNullOrUndefined(user)) {
      res.status(404).json(errorResponse(notFoundErr(userId, User)));
      return;
    }
    res.status(200).json(successResponse(user));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const userId = req.params.id;
  try {
    if (isNullOrUndefinedOrEmpty(req.body)) {
      res.status(400).json(errorResponse(INVALID_PAYLOAD_ERR));
      return;
    }
    const user = await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: 'after',
    });
    if (isNullOrUndefined(user)) {
      res.status(404).json(errorResponse(notFoundErr(userId, User)));
      return;
    }
    res.status(200).json(successResponse(user));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (isNullOrUndefined(user)) {
      res.status(404).json(errorResponse(notFoundErr(userId, User)));
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
