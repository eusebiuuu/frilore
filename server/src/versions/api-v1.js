import { Router } from 'express'
import projectRouter from '../api/project/project.router.js';
import taskRouter from '../api/task/task.router.js';
import notificationRouter from '../api/notification/notification.router.js';
import registrationRouter from '../api/registration/registration.router.js';
import listRouter from '../api/list/list.router.js';
import assignmentRouter from '../api/assignment/assignment.router.js';
import authRouter from '../api/auth/auth.router.js';

const version1Router = Router();

version1Router.use('/project', projectRouter);
version1Router.use('/task', taskRouter);
version1Router.use('/notification', notificationRouter);
version1Router.use('/registration', registrationRouter);
version1Router.use('/list', listRouter);
version1Router.use('/assignment', assignmentRouter);
version1Router.use('/auth', authRouter);

export default version1Router;