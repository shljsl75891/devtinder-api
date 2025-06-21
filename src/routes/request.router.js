import {Router} from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import {STATUS_CODES} from '../utils/index.js';

const requestRouter = Router();
requestRouter.use(userAuth);

requestRouter.get('/send', (req, res) => {
  res.status(STATUS_CODES.OK).json({
    message: `${res.locals.currentUser.firstName} sent the connection request to someone`,
  });
});

export default requestRouter;
