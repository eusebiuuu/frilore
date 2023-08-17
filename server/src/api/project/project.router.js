import { Router } from 'express'
import projectController from './project.controller.js'

const projectRouter = Router();

projectRouter.get('/members', projectController.getProjectsWithMembers);
projectRouter.get('/all', projectController.getAllProjects);
projectRouter.get('/:id', projectController.getSingleProjectInfo);
projectRouter.post('/', projectController.createProject);
projectRouter.patch('/:id', projectController.editProject);
projectRouter.delete('/:id', projectController.deleteProject);

export default projectRouter;