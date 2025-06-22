import validator from 'validator';
import CustomError from '../../utils/custom-error.js';
import {STATUS_CODES} from '../../utils/status-codes.js';

export default class AuthValidatorService {
  /** @param {Record<string, any>} data */
  login(data) {
    if (!data.email || !validator.isEmail(data.email)) {
      throw new CustomError(
        'Please enter a valid email address',
        STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!data.password) {
      throw new CustomError(
        'Please enter your strong password',
        STATUS_CODES.BAD_REQUEST,
      );
    }
  }

  /** @param {Record<string, any>} data */
  signUp(data) {
    const ALLOWED_FIELDS = ['firstName', 'lastName', 'email', 'password'];
    const hasInvalidFields = Object.keys(data).some(
      key => !ALLOWED_FIELDS.includes(key),
    );
    if (hasInvalidFields) {
      throw new CustomError(
        'Please enter your firstName, lastName, email, and password',
        STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!validator.isStrongPassword(data.password)) {
      throw new CustomError(
        'Please enter a strong password having uppercase, lowercase, numbers and symbols',
        STATUS_CODES.BAD_REQUEST,
      );
    }
  }

  /** @param {Record<string, any>} data */
  forgotPassword(data) {
    const REQUIRED_FIELDS = ['currentPassword', 'newPassword'];
    const hasAllFields = REQUIRED_FIELDS.every(field => field in data);
    if (!hasAllFields) {
      throw new CustomError(
        'Please confirm your current password and send new password',
        STATUS_CODES.BAD_REQUEST,
      );
    }
    if (data.currentPassword === data.newPassword) {
      throw new CustomError(
        'Please choose different password than your current password',
        STATUS_CODES.BAD_REQUEST,
      );
    }
  }
}
