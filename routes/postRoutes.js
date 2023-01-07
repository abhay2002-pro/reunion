import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addPost } from "../controllers/postController.js";

const router = express.Router();

router.route("/posts").get(isAuthenticated, addPost);

export default router;
