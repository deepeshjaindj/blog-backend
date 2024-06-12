import { Router } from 'express';
import { login, logout, refreshAccessToken, register } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

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

// Secure Routes
router.route('/logout').post(verifyJWT, logout);
router.route('/refresh-token').post(verifyJWT, refreshAccessToken);

export { router as userRouter };
