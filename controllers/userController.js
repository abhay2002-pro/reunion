import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";

export const login = catchAsyncError(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("Incorrect Email", 404));

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

  if (!follower_id.match(/^[0-9a-fA-F]{24}$/))
    return next(new ErrorHandler("Invalid Follow ID", 404));

  if (user.followings.includes(follower_id))
    return next(
      new ErrorHandler("User is already following the requested user", 404)
    );

  const follower_user = await User.findOne({ _id: follower_id });
  if (!follower_user)
    return next(new ErrorHandler("User requested to follow not found", 404));

  follower_user.followers.push(_id);
  user.followings.push(follower_id);

  await user.save();
  await follower_user.save();

  res.status(200).json({
    success: true,
    message: "User followed successfully",
  });
});

export const unfollow = catchAsyncError(async (req, res, next) => {
  const _id = req.user._id;
  const follower_id = req.params.id;

  const user = await User.findOne({ _id });
  if (!user) return next(new ErrorHandler("Logged in user not found", 404));

  if (!follower_id.match(/^[0-9a-fA-F]{24}$/))
    return next(new ErrorHandler("Invalid Follow ID", 404));

  const follower_user = await User.findOne({ _id: follower_id });
  if (!follower_user)
    return next(new ErrorHandler("User requested to unfollow not found", 404));

  if (!user.followings.includes(follower_id))
    return next(
      new ErrorHandler(
        "Authenticated user is not following the requested id",
        404
      )
    );

  follower_user.followers = follower_user.followers.filter(
    (curr_follower_id) => {
      return curr_follower_id !== _id;
    }
  );

  user.followings = user.followings.filter((curr_user_id) => {
    return curr_user_id !== follower_id;
  });

  await user.save();
  await follower_user.save();

  res.status(200).json({
    success: true,
    message: "User unfollowed successfully",
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
    },
  });
});
