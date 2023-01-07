import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { login, follow, unfollow, getUser, addPost } from "../controllers/userController.js";

const router = express.Router();

router.route("/authenticate").post(login);

router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
router.route("/user").get(isAuthenticated, getUser);
router.route("/posts").get(isAuthenticated, addPost);
export default router;
