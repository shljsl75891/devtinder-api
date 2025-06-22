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
  {
    statics: {
      /**
       * Finds a mutual request between two users regardless of direction.
       *
       * @param {string} sender - ID of the first user
       * @param {string} receiver - ID of the second user
       */
      findOneMutualRequest(sender, receiver) {
        return this.findOne({
          $or: [
            {sender, receiver},
            {sender: receiver, receiver: sender},
          ],
        });
      },
    },
    methods: {},
    timestamps: true,
  },
);

requestSchema.index({sender: 1, receiver: 1}, {unique: true});

requestSchema.pre('save', function (next) {
  if (this.sender.equals(this.receiver))
    throw new Error('A user cannot send connection request to itself');
  next();
});

const Request = model('Request', requestSchema);
export default Request;
