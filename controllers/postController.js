import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
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

export const likePost = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const post_id = req.params.id;

  const post = await Post.findOne({ _id: post_id });
  if (!post) return next(new ErrorHandler("Post not found", 404));

  post.likes.push(user);
  await post.save();

  res.status(200).json({
    success: true,
  });
});

export const dislikePost = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const post_id = req.params.id;

  const post = await Post.findOne({ _id: post_id });
  if (!post) return next(new ErrorHandler("Post not found", 404));

  post.likes = post.likes.filter((curr_user) => {
    return curr_user === user._id;
  });

  await post.save();

  res.status(200).json({
    success: true,
  });
});

export const addComment = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const post_id = req.params.id;

  const post = await Post.findOne({ _id: post_id });
  if (!post) return next(new ErrorHandler("Post not found", 404));

  const description = req.body.description;
  const comment = await Comment.create({ user, description });

  post.comments.push(comment);
  await post.save();
  res.status(200).json({
    success: true,
    comment_id: comment.id,
  });
});

export const getSinglePost = catchAsyncError(async (req, res, next) => {
  const post_id = req.params.id;

  const post = await Post.findOne({ _id: post_id });
  if (!post) return next(new ErrorHandler("Post not found", 404));

  res.status(200).json({
    success: true,
    post_details: {
      title: post.title,
      description: post.description,
      likes: post.likes.length,
      comments: post.comments.length,
    },
  });
});

export const getAllPostsByUser = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("User not found", 404));

  let posts = await Post.find({ user });

  posts = await Promise.all(
    posts.map(async (post) => {
      let comments = await Promise.all(
        post.comments.map(async (_id) => {
          const comment = await Comment.findOne({ _id });
          return comment.description;
        })
      );
      return {
        id: post._id,
        title: post.title,
        desc: post.description,
        created_at: post.createdAt.toISOString(),
        likes: post.likes.length,
        comments,
      };
    })
  );
  res.status(200).json({
    success: true,
    posts,
  });
});
