import {model, Schema} from 'mongoose';
import * as validator from 'validator';

const UserSchema = new Schema(
  {
    firstName: {
      type: 'String',
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: 'String',
      required: true,
      maxLength: 50,
    },
    email: {
      type: 'String',
      required: true,
      unique: true,
      validate: {
        validator: function (/** @type {string} */ val) {
          return validator.isEmail(val);
        },
      },
    },
    password: {
      type: 'String',
      required: true,
    },
    age: {
      type: 'Number',
      required: true,
      min: 18,
    },
    gender: {
      type: 'String',
      required: true,
      enum: ['male', 'female', 'other'],
    },
  },
  {timestamps: true},
);

const User = model('User', UserSchema);
export default User;
