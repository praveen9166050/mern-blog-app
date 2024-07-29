import express from 'express';
import { deleteUser, signout, updateUser } from '../controllers/users.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signout', signout);

router.use(verifyUser);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

export default router;