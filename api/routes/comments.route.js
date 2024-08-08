import express from 'express';
import { verifyUser } from "../utils/verifyUser.js";
import { createComment, getPostComments, likeComment } from '../controllers/comments.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyUser, likeComment);

export default router;