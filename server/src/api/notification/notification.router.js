import { Router } from 'express'
import notificationController from './notification.controller.js'

const notificationRouter = Router();

notificationRouter.get('/:id', notificationController.getNotifications);
notificationRouter.post('/', notificationController.createNotification);
notificationRouter.patch('/:id', notificationController.editNotification);
notificationRouter.delete('/:id', notificationController.deleteNotification);

export default notificationRouter;