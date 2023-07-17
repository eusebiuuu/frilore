import { Router } from 'express'
import taskController from './task.controller.js'

const taskRouter = Router();

taskRouter.get('/:id', taskController.getTasks);
taskRouter.post('/', taskController.createTask);
taskRouter.patch('/:id', taskController.editTask);
taskRouter.delete('/:id', taskController.deleteTask);

export default taskRouter;