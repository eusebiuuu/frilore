import { Router } from 'express'
import assignmentController from './assignment.controller.js'

const assignmentRouter = Router();

assignmentRouter.get('/', assignmentController.getAssignments);
assignmentRouter.post('/', assignmentController.createAssignment);
assignmentRouter.patch('/', assignmentController.editAssignment);
assignmentRouter.delete('/:id/:task', assignmentController.deleteAssignment);

export default assignmentRouter;