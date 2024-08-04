import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createPost, deletePosts, getPosts } from "../controllers/posts.controller.js";

const router = express.Router();

router.post('/create', verifyUser, createPost);
router.get('/getPosts', getPosts);
router.delete('/deletePost/:postId/:userId', verifyUser, deletePosts);

export default router;