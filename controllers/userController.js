import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
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
