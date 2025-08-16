import User from '../models/user.model.js';
import {CustomError, STATUS_CODES} from '../utils/index.js';

const INVALID_TOKEN_ERROR = new CustomError(
  'Invalid Token. Please login and try again',
  STATUS_CODES.UNAUTHORIZED,
);

/**
 * The middleware responsible for authenticating the JWT token
 * and calling next handler if user is authenticated, otherwise throws error
 * @type {import('express').RequestHandler}
 * @returns {Promise<void>}
 * @throws 401 - If user is not authenticated
 */
const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw INVALID_TOKEN_ERROR;
  const currentUser = await User.verifyJwt(token);
  res.locals.currentUser = currentUser;
  next();
};

export default userAuth;
