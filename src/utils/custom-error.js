import {STATUS_CODES} from './status-codes.js';

export default class CustomError extends Error {
  /** @type {number } */
  statusCode;
  /**
   * @param {string} message The error message to be thrown
   * @param {number} [code] Optional HTTP Status Code
   */
  constructor(message, code) {
    super(message);
    this.statusCode = code ?? STATUS_CODES.INTERNAL_SERVER_ERROR;
  }
}

/**
 * The generic express error handler to automatically
 * handle any unexpected error while processing any request
 * @param {CustomError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const genericErrorHandler = (err, req, res, next) => {
  res
    .status(err.statusCode ?? STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({message: err.message});
};
