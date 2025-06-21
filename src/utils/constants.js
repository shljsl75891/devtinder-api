import {STATUS_CODES} from './status-codes.js';

export const SALT_ROUNDS = 10;
export const HALF_HOUR_IN_MILLISECONDS = 1000 * 60 * 30;

/**
 * The generic express error handler to automatically
 * handle any unexpected error while processing any request
 * @type {import('express').ErrorRequestHandler}
 */
export const genericErrorHandler = (err, _1, res, _2) => {
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
};
