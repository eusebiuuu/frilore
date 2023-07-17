import { Router } from 'express'
import listController from './list.controller.js'

const listRouter = Router();

listRouter.get('/:id', listController.getLists);
listRouter.post('/', listController.createList);
listRouter.patch('/:id', listController.editList);
listRouter.delete('/:id', listController.deleteList);

export default listRouter;