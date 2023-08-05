import { Router } from 'express'
import messageController from './message.controller.js'

const messageRouter = Router();

messageRouter.get('/:id', messageController.getMessages);
messageRouter.post('/', messageController.createMessage);
messageRouter.delete('/:id', messageController.deleteMessage);

export default messageRouter;