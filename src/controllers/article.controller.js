import { Article } from "../models/article.model.js";
import { ApiError, ApiResponse, asyncHandler, uploadOnCloudinary } from "../utils/index.js";

const newArticle = asyncHandler(async (req, res) => {
  // get article data
  const { title, content, isPublished, tags } = req?.body;

  if (!title || !content) {
    throw new ApiError(400, 'Title and content are required')
  }

  // check for user id - only logged in user
  const userId = req?.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access")
  }

  // handle cover image
  const coverImage = req?.file?.path;

  if (!coverImage) {
    throw new ApiError(400, 'Cover Image is required')
  } 

  const coverImageResponse = await uploadOnCloudinary(coverImage);

  if (!coverImageResponse) {
    throw new ApiError(500, 'Something went wrong while uploading the image')
  }

  // create article
  const article = await Article.create({
    title,
    content,
    isPublished,
    tags: tags?.split(", "),
    author: userId,
    coverImage: coverImageResponse?.url,
  })

  if (!article) {
    throw new ApiError(500, 'Something went wrong while creating article')
  }

  // return response
  return res
    .status(201)
    .json(
      new ApiResponse(201, article, 'Article created successfully!')
    )
});

export {
  newArticle
}
