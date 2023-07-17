import { Router } from 'express'
import authController from './auth.controller.js'

const authRouter = Router();

authRouter.get('/:id', authController.getAuths);
authRouter.post('/', authController.createAuth);
authRouter.patch('/:id', authController.editAuth);
authRouter.delete('/:id', authController.deleteAuth);

export default authRouter;