import express, {request} from 'express';
import * as UserController from './../controllers/user-controller.js';
import verifyToken from '../middleware/auth.js'
import {healthCheck} from "./../controllers/user-controller.js";
const UserRouter = express.Router();

// Register all routes : CRUD operations.
UserRouter.route('/health-check').get(UserController.healthCheck);
UserRouter.route('/').get(UserController.getAllRegisteredUsers);
UserRouter.route('/register').post(UserController.registerUser);
UserRouter.route('/login').post(UserController.loginUser);
UserRouter.route('/email').put(UserController.validateUserByEmail);
UserRouter.route('/email').post(UserController.reSendOTP);
UserRouter.route('/:userId').put(verifyToken,UserController.updateUser);

export default UserRouter;