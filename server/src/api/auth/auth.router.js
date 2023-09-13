import { Router } from 'express'
import authController from './auth.controller.js'
import passport from 'passport';

const authRouter = Router();

authRouter.get('/', authController.getCurrentUser);

authRouter.post(
  '/register',
  authController.register,
  passport.authenticate('local', { successRedirect: '/' })
);

authRouter.post(
  '/login',
  passport.authenticate('local', { successRedirect: '/' })
);

authRouter.get(
  '/github/callback',
  passport.authenticate('github', { successRedirect: '/' }),
);
authRouter.get('/github', passport.authenticate('github'));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { successRedirect: '/' }),
);
authRouter.get('/google', passport.authenticate('google'));

authRouter.delete('/logout', authController.logout);

export default authRouter;