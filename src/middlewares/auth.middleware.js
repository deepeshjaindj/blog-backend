import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants.js';
import { User } from '../models/user.model.js';
import { ApiError, asyncHandler } from '../utils/index.js';

const verifyJWT = asyncHandler(async (req, res, next) => {
  // get token
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized access');
  }

  // decode token
  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id, { password: 0, refreshToken: 0 });

  if (!user) {
    throw new ApiError(401, 'Invalid access token');
  }

  req.user = user;
  next();
});

export { verifyJWT };