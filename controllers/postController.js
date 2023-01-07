import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import ErrorHandler from "../utils/errorHandler.js";

export const addPost = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;

  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const title = req.body.title;
  const description = req.body.description;

  const post = await Post.create({ title, description, user });
  res.status(200).json({
    success: true,
    post_details: {
      post_id: post._id,
      title: post.title,
      description: post.description,
      created_at: post.createdAt.toISOString(),
    },
  });
});

export const deletePost = catchAsyncError(async (req, res, next) => {
    const _id = req.user._id;
  
    const user = await User.findOne({ _id });
    if (!user) return next(new ErrorHandler("User not found", 404));
    
    const post_id = req.params.id;

    await Post.deleteOne({ _id: post_id });
    res.status(200).json({
      success: true,
    });
  });
