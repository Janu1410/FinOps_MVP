import express from 'express';
import * as authController from './auth.controller.js';
import { verifyUser } from '../../middlewares/verifyUser.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/me', verifyUser , authController.getUser);
router.put('/profile', verifyUser , authController.updateProfile);
router.get('/logout', verifyUser , authController.logout);  
router.post('/verify-email' , authController.verifyEmail);

export default router;