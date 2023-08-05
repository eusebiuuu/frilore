import { Router } from 'express'
import authController from './auth.controller.js'

const authRouter = Router();

authRouter.get('/', authController.getCurrentUser);
authRouter.get('/isValid', authController.isValidEmail);
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.delete('/logout', authController.logout);

export default authRouter;