import { Router } from 'express';
import { login, register } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(upload.fields([
  {
    name: 'avatar',
    maxCount: 1,
  },
  {
    name: 'coverImage',
    maxCount: 1
  }
]), register);

router.route('/login').post(login);


export { router as userRouter };
