import { Router } from 'express'
import projectRouter from '../api/project/project.router.js';
import taskRouter from '../api/task/task.router.js';
import notificationRouter from '../api/notification/notification.router.js';
import registrationRouter from '../api/registration/registration.router.js';
import listRouter from '../api/list/list.router.js';
import assignmentRouter from '../api/assignment/assignment.router.js';
import authRouter from '../api/auth/auth.router.js';
import messageRouter from '../api/message/message.router.js';
import userRouter from '../api/user/user.router.js';
import { checkAuthentication } from '../middlewares/checkAuthentication.js';

const version1Router = Router();

version1Router.use('/project', checkAuthentication, projectRouter);
version1Router.use('/task', checkAuthentication, taskRouter);
version1Router.use('/notification', checkAuthentication, notificationRouter);
version1Router.use('/registration', checkAuthentication, registrationRouter);
version1Router.use('/list', checkAuthentication, listRouter);
version1Router.use('/assignment', checkAuthentication, assignmentRouter);
version1Router.use('/auth', authRouter);
version1Router.use('/message', checkAuthentication, messageRouter);
version1Router.use('/user', userRouter);

export default version1Router;