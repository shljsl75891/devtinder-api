import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import Request from '../models/request.model.js';
import User from '../models/user.model.js';
import RequestValidatorService from '../services/validators/request-validator.service.js';
import {isNullOrUndefined, USER_SAFE_DATA} from '../utils/constants.js';
import CustomError from '../utils/custom-error.js';
import {RequestStatus} from '../utils/enum.js';
import {STATUS_CODES} from '../utils/status-codes.js';

const requestRouter = Router();
const requestValidator = new RequestValidatorService();
requestRouter.use(userAuth);

requestRouter.get('/participated', async (req, res) => {
  const currentUserId = res.locals.currentUser._id.toString();
  const requests = await Request.find({
    $or: [{sender: currentUserId}, {receiver: currentUserId}],
  })
    .populate('sender', 'firstName lastName')
    .populate('receiver', 'firstName lastName');
  res.status(STATUS_CODES.OK).json(requests);
});

requestRouter.get('/received', async (req, res) => {
  const requests = await Request.find({
    status: {$eq: RequestStatus.Interested},
    receiver: {$eq: res.locals.currentUser._id},
  }).populate('sender', USER_SAFE_DATA);
  res.status(STATUS_CODES.OK).json(requests);
});

requestRouter.patch('/review/:id/:status', async (req, res) => {
  const currentUser = res.locals.currentUser;
  requestValidator.review(req.params);
  const request = await Request.findOne({
    _id: req.params.id,
    status: RequestStatus.Interested,
    receiver: currentUser._id,
  });
  if (isNullOrUndefined(request)) {
    throw new CustomError(
      "There's no such connection request received by you",
      STATUS_CODES.NOT_FOUND,
    );
  }
  await Request.updateOne({_id: req.params.id}, {status: req.params.status});
  res.sendStatus(STATUS_CODES.NO_CONTENT);
});

requestRouter.post('/send/:status/:receiver', async (req, res) => {
  const currentUserId = res.locals.currentUser._id.toString();
  requestValidator.send({...req.params, sender: currentUserId});
  const {status, receiver} = req.params;
  const user = await User.findById(receiver, '_id');
  if (isNullOrUndefined(user)) {
    throw new CustomError(
      "Receiver of the connection request doesn't exist",
      STATUS_CODES.NOT_FOUND,
    );
  }

  const existingMutualRequest = await Request.findOneMutualRequest(
    currentUserId,
    receiver,
  );

  if (!isNullOrUndefined(existingMutualRequest)) {
    throw new CustomError(
      'A request between these users already exists.',
      STATUS_CODES.CONFLICT,
    );
  }

  const request = await Request.create({
    status: +status,
    receiver,
    sender: currentUserId,
  });

  await request.populate('receiver', 'firstName lastName');
  res.status(STATUS_CODES.OK).json({
    ...request.toJSON(),
    sender: {
      _id: currentUserId,
      firstName: res.locals.currentUser.firstName,
      lastName: res.locals.currentUser.lastName,
    },
  });
});

export default requestRouter;
