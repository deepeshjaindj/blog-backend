import { ApiError } from './ApiError';

const asyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch(err) {
    res
      .status(err.statusCode || 500)
      .json(
        new ApiError(err.statusCode, err.message, err.errors)
      );
  }
};

export { asyncHandler };
