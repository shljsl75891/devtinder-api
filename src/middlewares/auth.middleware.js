import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import {STATUS_CODES} from '../utils/index.js';

const INVALID_TOKEN_ERROR = {
  message: 'Invalid Token. Please login and try again',
};

/**
 * The middleware responsible for authenticating the JWT token
 * and calling next handler if user is authenticated, otherwise throws error
 * @type {import('express').RequestHandler}
 * @throws 401 - If user is not authenticated
 */
const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(STATUS_CODES.UNAUTHORIZED).json(INVALID_TOKEN_ERROR);
    return;
  }
  /** @type {object} */
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!('_id' in decodedToken)) {
    res.status(STATUS_CODES.UNAUTHORIZED).json(INVALID_TOKEN_ERROR);
    return;
  }

  const currentUser = await User.findOne(
    {_id: decodedToken._id},
    {password: 0},
  );
  if (!currentUser) {
    res.status(STATUS_CODES.UNAUTHORIZED).json(INVALID_TOKEN_ERROR);
    return;
  }

  res.locals.currentUser = currentUser;
  next();
};

export default userAuth;
