import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addPost, deletePost, likePost, dislikePost, addComment, getSinglePost } from "../controllers/postController.js";

const router = express.Router();

router.route("/posts").post(isAuthenticated, addPost);
router.route("/posts/:id").delete(isAuthenticated, deletePost);
router.route("/like/:id").post(isAuthenticated, likePost);
router.route("/unlike/:id").post(isAuthenticated, dislikePost);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/posts/:id").get(getSinglePost);

export default router;
