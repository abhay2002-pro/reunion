import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addPost, deletePost } from "../controllers/postController.js";

const router = express.Router();

router.route("/posts").post(isAuthenticated, addPost);
router.route("/posts/:id").delete(isAuthenticated, deletePost);

export default router;
