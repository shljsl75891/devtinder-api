import {model, Schema} from 'mongoose';
import {RequestStatus} from '../utils/enum.js';

const requestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: Number,
      required: true,
      enum: {
        values: Object.values(RequestStatus),
        message: '{VALUE} is not a valid request status',
      },
    },
  },
  {statics: {}, methods: {}, timestamps: true},
);

requestSchema.index({sender: 1, receiver: 1}, {unique: true});

const Request = model('Request', requestSchema);
export default Request;
