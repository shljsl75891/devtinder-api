import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
  const message = req.query.message;
  res.status(200).json({
    status: 'success',
    data: {message: message ?? 'OK'},
  });
});

export default router;
