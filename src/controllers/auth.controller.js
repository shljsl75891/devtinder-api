import {HALF_HOUR_IN_MILLISECONDS} from '../constants.js';
import User from '../models/user.model.js';
import {STATUS_CODES} from '../status-codes.js';
import AuthValidationService from '../utils/validations/auth.validation.js';

const INVALID_CREDENTIALS_ERROR = new Error('Invalid Credentials');

export default class AuthController {
  /** @type {AuthValidationService} */
  #authValidationService;

  /** @param {AuthValidationService} authValidationService*/
  constructor(authValidationService) {
    this.#authValidationService = authValidationService;
  }

  /** @type {import('express').RequestHandler} */
  async login(req, res) {
    try {
      this.#authValidationService.login(req.body);
      const {email, password} = req.body;
      const user = await User.findOne({email}, 'email password');
      if (!user) throw INVALID_CREDENTIALS_ERROR;
      const isPasswordCorrect = await user.validatePassword(password);
      if (isPasswordCorrect) {
        // Expires the cookie one minute before JWT get expired
        const expires = new Date(
          Date.now() + HALF_HOUR_IN_MILLISECONDS - 60000,
        );
        res.cookie('token', user.createJWT(), {expires});
        res
          .status(STATUS_CODES.OK)
          .json({message: 'You have login successfully'});
      } else throw INVALID_CREDENTIALS_ERROR;
    } catch (error) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({message: error.message});
    }
  }

  /** @type {import('express').RequestHandler} */
  async forgotPassword(req, res) {
    try {
      const currentUser = res.locals.currentUser;
      this.#authValidationService.forgotPassword(req.body);
      const {currentPassword, newPassword} = req.body;
      const user = await User.findById(currentUser._id, 'password');
      const isCurrentPasswordCorrect =
        await user.validatePassword(currentPassword);
      if (!isCurrentPasswordCorrect) {
        throw INVALID_CREDENTIALS_ERROR;
      }
      const passwordHash = await User.generatePasswordHash(newPassword);
      await User.findByIdAndUpdate(currentUser._id, {password: passwordHash});
      res.status(STATUS_CODES.NO_CONTENT).json({
        message: 'Password updated successfully',
      });
    } catch (error) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({message: error.message});
    }
  }
}
