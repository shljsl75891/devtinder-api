import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {model, Schema} from 'mongoose';
import validator from 'validator';
import {
  Gender,
  INVALID_TOKEN_ERROR,
  ONE_DAY_IN_MILLISECONDS,
  SALT_ROUNDS,
  USER_SAFE_DATA,
} from '../utils/index.js';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxlength: 20,
    },
    gender: {
      type: Number,
      enum: {
        values: Object.values(Gender),
        message: '{VALUE} is not a valid gender',
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: val => validator.isEmail(val),
        message: 'Email is not valid',
      },
    },
    profileImageUrl: {
      type: String,
      required: true,
      default: process.env.DEFAULT_PROFILE_IMAGE_URL,
      validate: {
        /** @param {string} val */
        validator: val => validator.isURL(val),
        message: 'Please upload a valid image URL',
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [18, 'User must be atleast 18 years old'],
    },
    about: {
      type: String,
      default: "Hey there ! I am using Devtinder. Let's connect",
      maxlength: [
        250,
        'The about section must contain maximum of 250 characters',
      ],
    },
    skills: {
      type: [String],
      validate: {
        /** @param {Array<string>} vals */
        validator: vals => vals.length >= 0 && vals.length <= 50,
        message: 'The number of skills must be less than or equal to 50',
      },
    },
  },
  {
    statics: {
      /** @param {string} token */
      verifyJwt: async function (token) {
        /** @type {object} */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!('_id' in decoded)) throw INVALID_TOKEN_ERROR;
        const user = await this.findById(decoded._id, USER_SAFE_DATA);
        if (!user) throw INVALID_TOKEN_ERROR;
        return user;
      },
      /**
       * @param {string} passwordInputByUser
       * Generates a password hash for the user to store
       */
      generatePasswordHash: function (passwordInputByUser) {
        return bcrypt.hash(passwordInputByUser, SALT_ROUNDS);
      },
    },
    methods: {
      /**
       * Validates the password sent in the payload
       * @param {string} passwordInputByUser
       * @returns {Promise<boolean>}
       */
      validatePassword: function (passwordInputByUser) {
        const passwordHash = this.password;
        return bcrypt.compare(passwordInputByUser, passwordHash);
      },
      /**
       * Creates a Auth JWT token with _id of the user
       * @returns {string}
       */
      createJWT: function () {
        return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
          expiresIn: ONE_DAY_IN_MILLISECONDS / 1000,
        });
      },
    },
    timestamps: true,
  },
);

const User = model('User', userSchema);
export default User;
