import {RequestStatus} from '../../utils/enum.js';

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
      throw new Error(
        'Please send correct payload having `status` and `receiver`',
      );
    }
    const {status} = params;
    if (!INTERESTED_IGNORED_STATUSES.includes(+status)) {
      throw new Error(
        'Please choose to either ignore or show interest in the user.',
      );
    }
  }

  /** @param {ReviewPayload} params  */
  review(params) {
    if (!ACCEPTED_REJECTED_STATUSES.includes(+params.status)) {
      throw new Error('Please choose to either accept or reject the request.');
    }
  }
}
