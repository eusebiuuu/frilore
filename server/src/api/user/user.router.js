import { Router } from 'express'
import userController from './user.controller.js'

const userRouter = Router();

userRouter.get('/teammates/:id', userController.getAllTeammates);
userRouter.get('/:id', userController.getSingleUser);
userRouter.patch('/', userController.editUser);
userRouter.delete('/', userController.deleteUser);

export default userRouter;