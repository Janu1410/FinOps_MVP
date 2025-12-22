import express from 'express';
import * as userController from './user.controller.js';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

export default router;
