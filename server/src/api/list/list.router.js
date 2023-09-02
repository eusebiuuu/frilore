import { Router } from 'express'
import listController from './list.controller.js'

const listRouter = Router();

listRouter.get('/', listController.getLists);
listRouter.post('/', listController.createList);
listRouter.patch('/order', listController.editListsOrder);
listRouter.delete('/tasks/:list/:project', listController.deleteAllTasks);
listRouter.delete('/:id', listController.deleteList);

export default listRouter;