import { Router } from 'express'
import userController from './user.controller.js'
import { checkAuthentication } from '../../middlewares/checkAuthentication.js';

const userRouter = Router();

userRouter.get('/teammates/:id', userController.getAllTeammates);
userRouter.get('/:id', userController.getSingleUser);
userRouter.post('/upload', checkAuthentication, userController.uploadImage);
userRouter.patch('/', checkAuthentication, userController.editUser);
userRouter.delete('/', checkAuthentication, userController.deleteUser);

export default userRouter;