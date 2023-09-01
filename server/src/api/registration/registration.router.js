import { Router } from 'express'
import registrationController from './registration.controller.js'

const registrationRouter = Router();

registrationRouter.get('/', registrationController.getRegistrations);
registrationRouter.post('/', registrationController.createRegistration);
registrationRouter.patch('/', registrationController.editRegistration);
registrationRouter.delete('/:projectID/:deleteUserID', registrationController.deleteRegistration);

export default registrationRouter;