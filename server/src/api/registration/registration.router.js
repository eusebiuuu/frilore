import { Router } from 'express'
import registrationController from './registration.controller.js'

const registrationRouter = Router();

registrationRouter.get('/', registrationController.getRegistrations);
registrationRouter.get('/single/:id', registrationController.getSingleRegistration);
registrationRouter.post('/', registrationController.createRegistration);
registrationRouter.patch('/:id', registrationController.editRegistration);
registrationRouter.delete('/:id', registrationController.deleteRegistration);

export default registrationRouter;