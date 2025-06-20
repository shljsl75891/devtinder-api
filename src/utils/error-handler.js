import {STATUS_CODES} from '../status-codes.js';

/**
 * The generic express error handler to automatically
 * handle any unexpected error while processing any request
 * @type {import('express').ErrorRequestHandler}
 */
const genericErrorHandler = (err, _1, res, _2) => {
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
};

export default genericErrorHandler;
