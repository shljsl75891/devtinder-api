import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import Request from '../models/request.model.js';
import User from '../models/user.model.js';
import RequestValidatorService from '../services/validators/request-validator.service.js';
import {isNullOrUndefined} from '../utils/constants.js';
import {RequestStatus} from '../utils/enum.js';
import {STATUS_CODES} from '../utils/status-codes.js';

const requestRouter = Router();
const requestValidator = new RequestValidatorService();
requestRouter.use(userAuth);

requestRouter.get('/participated', async (req, res) => {
  try {
    const currentUserId = res.locals.currentUser._id.toString();
    const requests = await Request.find({
      $or: [{sender: currentUserId}, {receiver: currentUserId}],
    })
      .populate('sender', 'firstName lastName')
      .populate('receiver', 'firstName lastName');
    res.status(STATUS_CODES.OK).json(requests);
  } catch (error) {
    res
      .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
      .json({message: error.message});
  }
});

requestRouter.get('/received', async (req, res) => {
  try {
    const requests = await Request.find({
      status: {$eq: RequestStatus.Interested},
      receiver: {$eq: res.locals.currentUser._id},
    }).populate('sender', 'firstName lastName');
    res.status(STATUS_CODES.OK).json(requests);
  } catch (error) {
    res
      .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
      .json({message: error.message});
  }
});

requestRouter.patch('/review/:id/:status', async (req, res) => {
  try {
    const currentUser = res.locals.currentUser;
    requestValidator.review(req.params);
    const request = await Request.findOne({
      _id: req.params.id,
      status: RequestStatus.Interested,
      receiver: currentUser._id,
    });
    if (isNullOrUndefined(request)) {
      throw new Error("There's no such connection request received by you");
    }
    await Request.updateOne({_id: req.params.id}, {status: req.params.status});
    res.sendStatus(STATUS_CODES.NO_CONTENT);
  } catch (error) {
    res.status(STATUS_CODES.NOT_FOUND).json({message: error.message});
  }
});

requestRouter.post('/send/:status/:receiver', async (req, res) => {
  try {
    const currentUser = res.locals.currentUser;
    requestValidator.send({
      ...req.params,
      sender: currentUser._id.toString(),
    });
    const {status, receiver} = req.params;
    const user = await User.findById(receiver, '_id');
    if (isNullOrUndefined(user)) {
      throw new Error("Receiver of the connection request doesn't exist");
    }

    const existingMutualRequest = await Request.findOne({
      $or: [
        {sender: currentUser._id, receiver},
        {sender: receiver, receiver: currentUser._id},
      ],
    });

    if (!isNullOrUndefined(existingMutualRequest)) {
      res.status(STATUS_CODES.CONFLICT).json({
        message: 'A request between these users already exists.',
      });
      return;
    }

    const request = await Request.create({
      status: +status,
      receiver,
      sender: currentUser._id,
    });
    await request.populate('receiver', 'firstName lastName');
    res.status(STATUS_CODES.OK).json({
      ...request.toJSON(),
      sender: {
        _id: currentUser._id.toString(),
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      },
    });
  } catch (error) {
    res
      .status(STATUS_CODES.UNPROCESSABLE_ENTITY)
      .json({message: error.message});
  }
});

export default requestRouter;
