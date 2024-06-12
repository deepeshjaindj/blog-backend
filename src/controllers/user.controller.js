import { COOKIE_OPTIONS } from '../constants.js';
import { User } from '../models/user.model.js';
import { ApiError, ApiResponse, asyncHandler, uploadOnCloudinary } from '../utils/index.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };    
  } catch (error) {
    throw new ApiError(500, error.message || 'Something went wrong white generating tokens.');
  }
};

const register = asyncHandler(async (req, res) => {
  const { username, password, email, fullName, age } = req.body;

  const fetchedFields = { username, email, fullName, password, age };

  // Validation - Not empty
  if (Object.keys(fetchedFields).some((field) => !fetchedFields[field]?.trim())) {
    const validationErrors = [];
    Object.keys(fetchedFields).forEach((field) => !fetchedFields[field]?.trim() 
      && validationErrors.push(`${field} is required`));

    throw new ApiError(400, 'Validation Error', validationErrors);
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    throw new ApiError(409, 'Username or email already exist');
  }

  // Check for images
  const avatarLocalFilePath = req?.files?.avatar?.[0]?.path;
  const coverImageLocalFilePath = req?.files?.coverImage?.[0]?.path;

  if (!avatarLocalFilePath) {
    throw new ApiError(400, 'Avatar image is required');
  }

  // Upload images on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalFilePath);
  let coverImage = null;

  if (coverImageLocalFilePath) {
    coverImage = await uploadOnCloudinary(coverImageLocalFilePath);
  }

  if (!avatar) {
    throw new ApiError(400, 'Valid avatar image is required');
  }

  // Create a user
  const createdUser = await User.create({
    username,
    email,
    password,
    fullName,
    age,
    avatar: avatar.url,
    coverImage: coverImage?.url,
  });
  
  const user = await User.findById(createdUser?._id, {
    password: 0
  });

  if (!user) {
    throw new ApiError(500, 'Something went wrong while registering the user.');
  }

  // Return res
  return res
    .status(201)
    .json(
      new ApiResponse(
        201, 
        user, 
        'User registered successfully!'
      )
    );

});

const login = asyncHandler(async(req, res) => {
  // get details from the user
  const { username, email, password } = req.body;

  // validation
  if (!username || !email) {
    throw new ApiError(400, 'Either username or email is required.');
  }

  if (!String(password).trim()){
    throw new ApiError(400, 'Password is required.');
  }

  // look for user in the DB
  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, 'User does not exist.');
  }

  // check password
  const isValidUser = await user.isPasswordCorrect(password);

  if (!isValidUser) {
    throw new ApiError(401, 'Incorrect password');
  }

  // generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);

  delete user.password;
  delete user.refreshToken;

  return res
    .status(200)
    .cookie('accessToken', accessToken, COOKIE_OPTIONS)
    .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        200,
        user,
        'User logged in successfully!'
      )
    );
});

export {
  register,
  login
};
