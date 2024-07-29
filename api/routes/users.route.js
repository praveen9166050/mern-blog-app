import express from 'express';
import { deleteUser, updateUser } from '../controllers/users.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.use(verifyUser);
router.put('/update/:userId', updateUser);
router.put('/delete/:userId', deleteUser);

export default router;