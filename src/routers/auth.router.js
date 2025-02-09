import {Router} from 'express';
import {INVALID_PAYLOAD_ERR} from '../constants.js';
import User from '../models/user.model.js';
import {
  errorResponse,
  isNullOrUndefinedOrEmpty,
  successResponse,
} from '../utils.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    if (isNullOrUndefinedOrEmpty(req.body)) {
      res.status(400).json(errorResponse(INVALID_PAYLOAD_ERR));
      return;
    }
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(200).json(successResponse(savedUser.toJSON()));
  } catch (err) {
    next(err);
  }
});

export default router;
