import { Router } from 'express'
import projectController from './project.controller.js'

const projectRouter = Router();

projectRouter.get('/tasks', projectController.getAllProjectsWithAssignedTasks);
projectRouter.get('/members', projectController.getProjectsWithMembers);
projectRouter.get('/:id', projectController.getSingleProjectInfo);
projectRouter.get('/', projectController.getAllProjects);
projectRouter.post('/', projectController.createProject);
projectRouter.patch('/:id', projectController.editProject);
projectRouter.delete('/:id', projectController.deleteProject);

export default projectRouter;