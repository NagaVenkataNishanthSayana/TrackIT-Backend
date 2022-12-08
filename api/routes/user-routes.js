import express from 'express';
import * as UserController from './../controllers/user-controller.js';
import verifyToken from '../middleware/auth.js'
const UserRouter = express.Router();

// Register all UserController routes.
UserRouter.route('/').get(UserController.getAllRegisteredUsers);
UserRouter.route('/register').post(UserController.registerUser);
UserRouter.route('/login').post(UserController.loginUser);
UserRouter.route('/email').put(UserController.validateUserByEmail);
UserRouter.route('/email').post(UserController.reSendOTP);
UserRouter.route('/:userId').put(verifyToken,UserController.updateUser);

export default UserRouter;