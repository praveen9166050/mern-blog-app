import express from 'express';
import { verifyUser } from "../utils/verifyUser.js";
import { createComment, getPostComments } from '../controllers/comments.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.get('/getPostComments/:postId', getPostComments);

export default router;