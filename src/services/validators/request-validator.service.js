import CustomError from '../../utils/custom-error.js';
import {RequestStatus} from '../../utils/enum.js';
import {STATUS_CODES} from '../../utils/status-codes.js';

/** @type {number[]} */
export const ACCEPTED_REJECTED_STATUSES = [
  RequestStatus.Accepted,
  RequestStatus.Rejected,
];
/** @type {number[]} */
export const INTERESTED_IGNORED_STATUSES = [
  RequestStatus.Interested,
  RequestStatus.Ignored,
];

/**
 * @typedef SendPayload
 * @property {string} status
 * @property {string} sender
 * @property {string} receiver
 */

/**
 * @typedef ReviewPayload
 * @property {string} id
 * @property {string} status
 */

export default class RequestValidatorService {
  /** @param {SendPayload} params  */
  send(params) {
    if (!['status', 'sender', 'receiver'].every(f => f in params)) {
      throw new CustomError(
        'Please send correct payload having `status` and `receiver`',
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }
    const {status} = params;
    if (!INTERESTED_IGNORED_STATUSES.includes(+status)) {
      throw new CustomError(
        'Please choose to either ignore or show interest in the user.',
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }
  }

  /** @param {ReviewPayload} params  */
  review(params) {
    if (!ACCEPTED_REJECTED_STATUSES.includes(+params.status)) {
      throw new CustomError(
        'Please choose to either accept or reject the request.',
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
