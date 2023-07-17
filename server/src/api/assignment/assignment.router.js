import { Router } from 'express'
import assignmentController from './assignment.controller.js'

const assignmentRouter = Router();

assignmentRouter.get('/:id', assignmentController.getAssignments);
assignmentRouter.post('/', assignmentController.createAssignment);
assignmentRouter.patch('/:id', assignmentController.editAssignment);
assignmentRouter.delete('/:id', assignmentController.deleteAssignment);

export default assignmentRouter;