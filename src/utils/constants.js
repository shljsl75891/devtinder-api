import CustomError from './custom-error.js';
import {STATUS_CODES} from './status-codes.js';

export const SALT_ROUNDS = 10;
export const HALF_HOUR_IN_MILLISECONDS = 1000 * 60 * 30;

export const USER_SAFE_DATA =
  'firstName lastName gender age about profileImageUrl skills';

/** @param {unknown} val
 * @returns {val is null | undefined}
 */
export const isNullOrUndefined = val => val === null || val === undefined;

export const INVALID_TOKEN_ERROR = new CustomError(
  'Invalid Token. Please login and try again',
  STATUS_CODES.UNAUTHORIZED,
);
