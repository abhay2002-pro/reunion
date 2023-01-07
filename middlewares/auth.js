import { catchAsyncError } from "./catchAsyncError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token ", token);

  if (token == null) return res.sendStatus(404);
  jwt.verify(token, process.env.JWT_SECRET, (err, id) => {
    if (err) return res.sendStatus(403);
    req.user = id;
    next();
  });
});
