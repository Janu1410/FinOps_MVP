import express from 'express';
import * as authController from './auth.controller.js';
import { decodeUser } from '../../middlewares/decodeUser.js';
import { decode } from 'node:punycode';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/signin', authController.signIn);
router.get('/me', decodeUser , authController.getUser);
router.put('/profile', decodeUser , authController.updateProfile);
router.get('/logout', decodeUser , authController.logout);  
router.post('/verify-email' , authController.verifyEmail);

export default router;