import CustomError from '../../utils/custom-error.js';
import {STATUS_CODES} from '../../utils/status-codes.js';

export default class UserValidatorService {
  /** @param {Record<string, any>} data */
  updateProfile(data) {
    const ALLOWED_FIELDS_TO_UPDATE = [
      'gender',
      'age',
      'profileImageUrl',
      'skills',
      'about',
    ];
    const payloadKeys = Object.keys(data);
    if (payloadKeys.includes('password')) {
      throw new CustomError(
        'Please use forgot password',
        STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!payloadKeys.every(k => ALLOWED_FIELDS_TO_UPDATE.includes(k))) {
      throw new CustomError(
        'Only some of the attributes can be updated',
        STATUS_CODES.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
