import { Router } from 'express'
import notificationController from './notification.controller.js'

const notificationRouter = Router();

notificationRouter.get('/', notificationController.getNotifications);

export default notificationRouter;