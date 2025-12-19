import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyUser } from '../middlewares/verifyUser.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/me', verifyUser , authController.getUser);
router.get('/logout', verifyUser , authController.logout);  

export default router;
