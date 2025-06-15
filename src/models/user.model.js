import {model, Schema} from 'mongoose';
import validator from 'validator';
import {Gender} from '../enum.js';

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
      enum: Object.values(Gender),
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
        validator: val => validator.isURL(val),
        message: 'Please upload a valid image URL',
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: val => validator.isStrongPassword(val),
        message:
          'Please enter a strong password having uppercase, lowercase, numbers and symbols',
      },
    },
    age: {
      type: Number,
      min: [18, 'User must be atleast 18 years old'],
    },
    skills: {
      type: [String],
      validate: {
        validator: vals => vals.length >= 0 && vals.length <= 50,
        message: 'The number of skills must be less than or equal to 50',
      },
    },
  },
  {timestamps: true},
);

const User = model('User', userSchema);

export default User;
