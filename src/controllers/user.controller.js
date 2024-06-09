import { User } from '../models/user.model.js';
import { ApiError, ApiResponse, asyncHandler, uploadOnCloudinary } from '../utils/index.js';

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

export {
  register
};
