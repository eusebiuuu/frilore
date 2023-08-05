import { Router } from 'express'
import userController from './user.controller.js'

const userRouter = Router();

userRouter.patch('/', userController.editUser);
userRouter.delete('/', userController.deleteUser);

export default userRouter;