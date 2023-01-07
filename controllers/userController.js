import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import ErrorHandler from "../utils/errorHandler.js";

export const login = catchAsyncError(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.password !== password)
    return next(new ErrorHandler("Incorrect Password", 404));

  const accessToken = user.getJWTToken();
  user.access_token = accessToken;

  await user.save();

  res.status(200).json({
    success: true,
    jwt_token: accessToken,
  });
});

export const follow = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const follower_id = req.params.id;

  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("Logged in user not found", 404));

  const follower_user = await User.findOne({ _id: follower_id });
  if (!follower_user)
    return next(new ErrorHandler("User requested to follow not found", 404));

  follower_user.followers.push(follower_id);
  user.followings.push(_id);

  await user.save();
  await follower_user.save();

  res.status(200).json({
    success: true,
  });
});

export const unfollow = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const follower_id = req.params.id;

  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("Logged in user not found", 404));

  const follower_user = await User.findOne({ _id: follower_id });
  if (!follower_user)
    return next(new ErrorHandler("User requested to unfollow not found", 404));

  follower_user.followers = follower_user.followers.filter(
    (curr_follower_id) => {
      return curr_follower_id !== follower_id;
    }
  );

  user.followings = user.followings.filter((curr_user_id) => {
    return curr_user_id !== _id;
  });

  await user.save();
  await follower_user.save();

  res.status(200).json({
    success: true,
  });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;

  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  
  res.status(200).json({
    success: true,
    user_details: {
      name: user.username,
      followers: user.followers.length,
      followings: user.followings.length,
    }
  });
});

export const addPost = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;

  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const title = req.body.title
  const description = req.body.description

  const post = await Post.create({title, description});
  res.status(200).json({
    success: true,
    post_details: {
      post_id: post._id,
      title: post.title,
      description: post.description,
      created_at: post.createdAt.toISOString(),
    }
  });
});