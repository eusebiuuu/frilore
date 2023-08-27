import { Router } from 'express'
import messageController from './message.controller.js'

const messageRouter = Router();

messageRouter.get('/:id', messageController.getMessages);

export default messageRouter;