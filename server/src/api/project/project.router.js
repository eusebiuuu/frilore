import { Router } from 'express'
import projectController from './project.controller.js'

const projectRouter = Router();

projectRouter.get('/:id', projectController.getProjects);
projectRouter.post('/', projectController.createProject);
projectRouter.patch('/:id', projectController.editProject);
projectRouter.delete('/:id', projectController.deleteProject);

export default projectRouter;